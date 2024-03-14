import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { boolean } from 'joi';
import { Concerts } from 'src/concert/entities/concert.entity';
import { User } from 'src/user/entities/user.entity';
import { Seats } from 'src/concert/entities/seat.entity';

@Entity({
  name: 'ticketings',
})
export class Ticketings {
  @PrimaryGeneratedColumn()
  id: number;

  //concerts와 ticketings는 1:N관계
  @ManyToOne(() => Concerts, (concert) => concert.ticket)
  @JoinColumn({ name: 'concertId' })
  concert: Concerts;

  @Column('int', { name: 'concertId', select: true, nullable: false })
  concertId: number;

  //users와 ticketings는 1:N관계
  @ManyToOne(() => User, (user) => user.ticket)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('int', { name: 'userId', select: true, nullable: false })
  userId: number;

  //seats와 ticketings는 1:N관계
  @ManyToOne(() => Seats, (seat) => seat.ticket)
  @JoinColumn({ name: 'seatId' })
  seat: Seats;

  @Column('int', { name: 'seatId', select: true, nullable: false })
  seatId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
