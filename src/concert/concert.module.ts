import { Module } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';
import { Concerts } from './entities/concert.entity';
import { Seats } from './entities/seat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Concerts, Seats])],
  providers: [ConcertService],
  controllers: [ConcertController],
  exports: [ConcertService],
})
export class ConcertModule {}
