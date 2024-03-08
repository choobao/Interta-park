import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateDto {
  @IsEmail({}, { message: '유효한 이메일을 입력해주세요.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @Min(6, { message: '비밀번호는 최소 6자 이상입니다.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;
}
