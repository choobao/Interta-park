import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PointDto {
  @IsNumber()
  @IsNotEmpty({ message: '포인트를 입력해주세요' })
  point: number;

  @IsString()
  @IsNotEmpty({ message: '사유를 입력해주세요.' })
  content: string;
}
