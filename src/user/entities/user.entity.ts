import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../types/userRole.type';
import { Point } from './point.entity';
import { boolean } from 'joi';
import { Ticketings } from 'src/ticket/entities/ticketing.entity';
import { Concerts } from 'src/concert/entities/concert.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'boolean', default: false })
  role: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Point, (point) => point.user)
  point: Point[];

  @OneToMany(() => Ticketings, (ticket) => ticket.user)
  ticket: Ticketings[];

  @OneToMany(() => Concerts, (concert) => concert.user)
  concert: Concerts[];
}
