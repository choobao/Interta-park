import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty({ message: '공연 제목을 입력해주세요.' })
  title: string;

  @IsString()
  Image: string;

  @IsString()
  @IsNotEmpty({ message: '공연 카테고리를 입력해주세요.' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: '공연 설명을 입력해주세요.' })
  contents: string;

  @IsString()
  @IsNotEmpty({ message: '공연 날짜와 시간을 입력해주세요.' })
  date: string;

  @IsString()
  @IsNotEmpty({ message: '공연 장소를 입력해주세요.' })
  location: string;
}
