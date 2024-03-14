import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateDto } from './dto/create-concert';
import { LevelGuard } from 'src/level/level.guard';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decoreator';
import { createSeatDto } from './dto/create-seat';
import { SearchDto } from './dto/search-concert';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/types/userRole.type';

@Controller('concert')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  //공연 등록(어드민만 가능)
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.true)
  @Post()
  async NewConcert(
    @UserInfo() user: User,
    @Body() createDto: CreateDto,
    @Res() res,
  ) {
    const createConcert = await this.concertService.newConcert(
      createDto.title,
      createDto.Image,
      createDto.category,
      createDto.contents,
      createDto.date,
      createDto.location,
      user.id,
    );

    res
      .status(201)
      .json({ message: '공연 준비중으로 공연등록이 완료되었습니다.' });
  }

  //좌석 등록
  @UseGuards(AuthGuard('jwt'))
  @Roles(Role.true)
  @Post('seat/:concertId')
  async concertSeat(
    @Param('concertId', ParseIntPipe) concertId: number,
    @UserInfo() user: User,
    @Body() createSeatDto: createSeatDto,
    @Res() res,
  ) {
    const concertSeat = await this.concertService.concertSeat(
      concertId,
      user.id,
      createSeatDto.seatGrade,
      createSeatDto.price,
      createSeatDto.ea,
    );

    return res
      .status(201)
      .json({ message: '좌석이 정상적으로 등록되었습니다.' });
  }

  //공연 status 변경(어드민만 가능)
  async changeStatus() {}

  //공연 목록 보기
  @Get()
  async GetConcert() {
    const concertData = await this.concertService.GetConcert();
    return concertData;
  }

  //공연 검색(공연명 검색)
  @Post('search')
  async SearchConcert(@Body() searchDto: SearchDto) {
    const searchData = await this.concertService.SearchConcert(
      searchDto.search,
    );

    return searchData;
  }

  //공연 상세보기(예매 가능 여부 함께 반환)
  @Get(':concertId')
  async detailConcert(@Param('concertId', ParseIntPipe) id: number) {
    const detailConcert = await this.concertService.DetailConcert(id);

    return detailConcert;
  }
}
