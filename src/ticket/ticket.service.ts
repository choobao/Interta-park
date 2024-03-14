import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticketings } from './entities/ticketing.entity';
import { Concerts } from 'src/concert/entities/concert.entity';
import { Seats } from 'src/concert/entities/seat.entity';
import { QueryRunner, Repository } from 'typeorm';
import { role } from 'src/concert/types/seatRole.types';
import { Point } from 'src/user/entities/point.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticketings)
    private readonly ticketRepository: Repository<Ticketings>,
    @InjectRepository(Concerts)
    private readonly concertRepository: Repository<Concerts>,
    @InjectRepository(Seats)
    private readonly seatRepository: Repository<Seats>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
  ) {}

  getPointRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository<Point>(Point) : this.pointRepository;
  }

  getSeatsRepository(qr?: QueryRunner) {
    return qr ? qr.manager.getRepository<Seats>(Seats) : this.seatRepository;
  }

  getTicketingRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<Ticketings>(Ticketings)
      : this.ticketRepository;
  }

  //티켓구매
  async BuyTicket(
    id: number,
    concertId: number,
    seatGrade: role,
    qr?: QueryRunner,
  ) {
    //콘서트 검색
    const concert = await this.concertRepository.findOne({
      where: { id: concertId },
    });

    if (!concert) {
      throw new NotFoundException('해당하는 공연이 존재하지 않습니다.');
    }

    // 콘서트 아이디와 좌석등급 보내주면 일치하는 좌석 있는지 확인(isSaled: false)
    const findSeats = await this.seatRepository.count({
      where: { seatGrade, isSaled: false, concert: { id: concertId } },
    });
    console.log(findSeats);

    //없으면 throw
    if (findSeats == 0) {
      throw new ServiceUnavailableException('판매가능한 좌석이 없습니다.');
    }

    //해당 유저가 얼마나 포인트를 보유하고있는지 확인
    const userPoint = await this.pointRepository.findOne({
      where: { user: { id } },
      order: { history: 'desc' },
    });

    const seatInfo = await this.seatRepository.findOne({
      where: { seatGrade, isSaled: false, concert: { id: concertId } },
      order: { id: 'asc' },
    });

    //좌석가격보다 작을시 잔액이 부족합니다
    if (userPoint.point < seatInfo.price) {
      throw new ForbiddenException('포인트가 부족합니다.');
    }
    console.log(seatInfo);

    //트랜잭션!!!
    const TRpointRepository = this.getPointRepository(qr);
    const TRticketingRepository = this.getTicketingRepository(qr);
    const TRSeatsRepository = this.getSeatsRepository(qr);

    // 티케팅 테이블에 유저 넣는식으로 등록하기
    //티켓 테이블에 유저아이디, 시트아이디, 콘서트아이디 정보 넣어주기
    const GetTicket = await TRticketingRepository.save({
      concertId,
      userId: id,
      seatId: seatInfo.id,
    });

    //해당 좌석 아이디는 isSaled = true 로 update 해주기
    const SaledSeat = await TRSeatsRepository.save({
      id: seatInfo.id,
      isSaled: true,
    });

    // 포인트있으면 구매 완료
    const usePoint = userPoint.point - seatInfo.price;

    const updatePoint = await TRpointRepository.save({
      user: { id },
      point: usePoint,
      content: `${seatGrade} 구매`,
    });
  }

  async GetTicket(id: number) {
    const tickets = await this.ticketRepository.find({
      where: { userId: id },
      order: { id: 'desc' },
    });

    if (tickets.length === 0) {
      throw new NotFoundException('예매내역이 존재하지 않습니다.');
    }
    console.log(tickets);

    const ticketBox = [];

    for (let i = 0; i < tickets.length; i++) {
      ticketBox.push(tickets[i]);

      const concert = await this.concertRepository.findOne({
        where: { id: tickets[i].concertId },
        select: ['title', 'date', 'location'],
      });

      ticketBox.push(concert);

      const seat = await this.seatRepository.findOne({
        where: { id: tickets[i].seatId },
        select: ['seatGrade'],
      });

      ticketBox.push(seat);
    }

    return ticketBox;
  }
}
