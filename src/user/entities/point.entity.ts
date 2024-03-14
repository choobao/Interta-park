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

import { Role } from '../types/userRole.type';
import { IsInt, Min } from 'class-validator';
import { User } from './user.entity';

@Entity({
  name: 'point',
})
export class Point {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.point)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('int', { name: 'userId', select: true, nullable: false })
  userId: number;

  // @OneToOne(() => User, (user) => user.point)
  // user: User;
  //유저와 유저포인트는 1:1관계

  @Column({ type: 'int', nullable: false })
  @IsInt()
  @Min(0)
  point: number;

  @Column({ type: 'varchar', nullable: false })
  content: string;

  @CreateDateColumn()
  history: Date;
}
