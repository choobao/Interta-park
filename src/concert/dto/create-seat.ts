import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { role } from '../types/seatRole.types';

export class createSeatDto {
  @IsEnum(role, { message: '유효하지 않은 좌석 등급입니다.' })
  @IsNotEmpty({ message: '좌석 등급을 입력해주세요.' })
  seatGrade: role;

  @IsNumber()
  @IsNotEmpty({ message: '좌석 가격을 입력해주세요.' })
  price: number;

  @IsNumber()
  @IsNotEmpty({ message: '좌석 갯수를 입력해주세요.' })
  ea: number;
}
