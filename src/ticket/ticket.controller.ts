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
import { TicketService } from './ticket.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo.decoreator';
import { ticketingDto } from './dto/ticketing.dto';
import { DataSource, QueryRunner } from 'typeorm';
import { query } from 'express';

@Controller('ticket')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly dataSource: DataSource,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('/:concertId')
  async Ticketing(
    @UserInfo() user: User,
    @Param('concertId', ParseIntPipe) concertId: number,
    @Body() ticketingDto: ticketingDto,
    @Res() res,
  ) {
    //트랜잭션과 관련된 모든 쿼리를 담당할 쿼리 러너 생성
    const qr = this.dataSource.createQueryRunner();

    //쿼리 러너에 연결
    await qr.connect();

    //쿼리 러너에서 트랜잭션을 시작
    //(이 시점부터 같은 쿼리러너를 사용하면 트랜잭션 안에서
    //데이터베이스 액션실행 가능)
    await qr.startTransaction();

    //로직 실행
    try {
      const ticketing = await this.ticketService.BuyTicket(
        user.id,
        concertId,
        ticketingDto.seatGrade,
      );

      await qr.commitTransaction();

      return res
        .status(201)
        .json({ message: '좌석 구매를 정상적으로 완료했습니다.' });
    } catch (error) {
      //어떤 에러든 에러가 던져지면 트랜잭션을 종료하고
      //원래 상태로 되돌린다.
      //트랜색션을 롤백하고, 종료한다!
      await qr.rollbackTransaction();
      return res.status(error.getStatus()).json({ message: error.message });
    } finally {
      await qr.release();
      return res
        .status(500)
        .json({ message: '알 수 없는 에러가 발생했습니다.' });
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async GetTicket(@UserInfo() user: User) {
    const GetTicket = await this.ticketService.GetTicket(user.id);

    return GetTicket;
  }
}
