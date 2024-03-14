import { IsEnum, IsNotEmpty } from 'class-validator';
import { role } from 'src/concert/types/seatRole.types';

export class ticketingDto {
  @IsEnum(role, { message: '유효하지 않은 좌석 등급입니다.' })
  @IsNotEmpty({ message: '좌석 등급을 입력해주세요.' })
  seatGrade: role;
}
