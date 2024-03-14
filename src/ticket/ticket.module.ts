import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { Ticketings } from './entities/ticketing.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concerts } from 'src/concert/entities/concert.entity';
import { Seats } from 'src/concert/entities/seat.entity';
import { Point } from 'src/user/entities/point.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticketings, Concerts, Seats, Point])],
  providers: [TicketService],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}
