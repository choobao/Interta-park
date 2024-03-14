import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Seats } from './entities/seat.entity';
import { ILike, Like, QueryRunner, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Concerts } from './entities/concert.entity';
import { Role } from './types/concertRole.types';
import { role } from './types/seatRole.types';

@Injectable()
export class ConcertService {
  constructor(
    @InjectRepository(Concerts)
    private readonly concertRepository: Repository<Concerts>,
    @InjectRepository(Seats)
    private readonly seatRepository: Repository<Seats>,
  ) {}

  //공연 등록(어드민만 가능)
  async newConcert(
    title: string,
    Image: string,
    category: string,
    contents: string,
    date: string,
    location: string,
    id: number,
    queryRunner?: QueryRunner,
  ) {
    console.log(id);
    const concert = await this.concertRepository.save({
      title,
      Image,
      category,
      contents,
      date,
      location,
      user: { id },
    });
  }

  //공연 status 변경(어드민만 가능)
  async changeStatus() {}

  //공연 목록 보기
  async GetConcert() {
    const concert = await this.concertRepository.find({
      //   where: { status: Role.onSale },
      select: ['id', 'title', 'category', 'date', 'location', 'status'],
    });

    if (!concert) {
      throw new NotFoundException('현재 진행중인 공연이 없습니다.');
    }

    return concert;
  }

  //좌석 등록(어드민만 가능)
  async concertSeat(
    concertId: number,
    id: number,
    seatGrade: role,
    price: number,
    ea: number,
  ) {
    //콘서트 아이디로 해당콘서트를 찾기
    const concert = await this.concertRepository.findOne({
      where: { id: concertId, user: { id } },
    });

    //콘서트가 존재하지 않을시 throw & 콘서트 userId와 id가 일치하지않을시 throw
    if (!concert) {
      throw new NotFoundException('해당하는 공연이 존재하지 않습니다.');
    }

    //ea 만큼 좌석을 생성하기
    for (let i = 0; i < ea; i++) {
      const createSeat = await this.seatRepository.save({
        seatGrade,
        price,
        concert: { id: concertId },
      });
    }
  }

  //공연 검색(공연명 검색)
  async SearchConcert(search: string) {
    console.log(search);
    //search가 공연 title에 포함되어있는지 검색
    const searchData = await this.concertRepository.find({
      where: { title: Like(`%${search}%`) },
      select: ['id', 'title', 'category', 'date', 'location'],
    });

    console.log(searchData);
    //없을시 throw
    if (searchData.length == 0) {
      throw new NotFoundException('해당하는 공연이 존재하지 않습니다.');
    }

    return searchData;
  }

  //공연 상세보기(예매 가능 여부 함께 반환) & 좌석 갯수도 같이 반환하기
  async DetailConcert(id: number) {
    const concert = await this.concertRepository.findOne({
      where: { id },
    });

    if (!concert) {
      throw new NotFoundException('해당하는 공연이 없습니다.');
    }

    //onsale이 아닐경우는 좌석갯수 반환하지않음
    if (concert.status !== Role.onSale) {
      return concert;
    }

    //좌석 등급별 isSaled가 false인것들의 개수
    const AGrade = await this.seatRepository.count({
      where: { concert: { id }, seatGrade: role.AGrade, isSaled: false },
    });
    const SuperiorGrade = await this.seatRepository.count({
      where: { concert: { id }, seatGrade: role.SuperiorGrade, isSaled: false },
    });
    const RoyalGrade = await this.seatRepository.count({
      where: { concert: { id }, seatGrade: role.RoyalGrade, isSaled: false },
    });

    const seatsInfo = `A Grade 좌석: ${AGrade}, Superior Grade 좌석: ${SuperiorGrade}, Royal Grade 좌석: ${RoyalGrade}`;

    return { concert, seatsInfo };
  }
}
