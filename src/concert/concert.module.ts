import { Module } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { ConcertController } from './concert.controller';

@Module({
  providers: [ConcertService],
  controllers: [ConcertController]
})
export class ConcertModule {}
