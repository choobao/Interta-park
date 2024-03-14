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
import { Role } from '../types/concertRole.types';
import { Seats } from './seat.entity';
import { Ticketings } from 'src/ticket/entities/ticketing.entity';
import { User } from 'src/user/entities/user.entity';

@Entity({
  name: 'concerts',
})
export class Concerts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', default: '저장된 이미지가 없습니다.' })
  Image: string;
  //이미지 url로 받아오기

  @Column({ type: 'varchar', nullable: false })
  category: string;

  @Column({ type: 'varchar', nullable: false })
  contents: string;

  @Column({ type: 'varchar', nullable: false })
  date: string;

  @Column({ type: 'varchar', nullable: false })
  location: string;

  @Column({ type: 'enum', enum: Role, default: Role.preparation })
  status: Role;

  //concerts와 seats는 1:N
  @OneToMany(() => Seats, (seat) => seat.concert)
  seat: Seats[];

  //concerts와 ticketings는 1:N관계
  @OneToMany(() => Ticketings, (ticket) => ticket.concert)
  ticket: Ticketings[];

  //user와 concerts는 1:N관계
  @ManyToOne(() => User, (user) => user.concert)
  user: User;
}
