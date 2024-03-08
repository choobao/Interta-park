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
import { IsInt, Min } from 'class-validator';
import { User } from './user.entity';

@Entity({
  name: 'point',
})
export class Point {
  @PrimaryGeneratedColumn()
  pointId: number;

  @Column({ type: 'int', default: 1000000 })
  @IsInt()
  @Min(0)
  point: number;
  //가입시 기본적으로 백만포인트

  @OneToOne(() => User)
  user: User;
  //유저와 유저포인트는 1:1관계
}
