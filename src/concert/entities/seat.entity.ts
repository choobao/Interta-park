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
import { role } from '../types/seatRole.types';
import { IsInt, Max, Min } from 'class-validator';
import { Concerts } from './concert.entity';
import { Ticketings } from 'src/ticket/entities/ticketing.entity';

@Entity({
  name: 'seats',
})
export class Seats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: role })
  seatGrade: role;

  @Min(0)
  @Max(50000)
  @IsInt()
  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'boolean', default: false })
  isSaled: boolean;

  //concerts와 seats는 1:N
  @ManyToOne(() => Concerts, (concert) => concert.seat)
  concert: Concerts;

  //seats와 ticketing은 1:N
  @OneToMany(() => Ticketings, (ticket) => ticket.seat)
  ticket: Ticketings[];
}
