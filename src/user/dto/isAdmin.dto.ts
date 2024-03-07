import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  @IsNotEmpty({ message: '관계자 비밀번호를 입력해주세요.' })
  isAdmin: string;
}
