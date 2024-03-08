import {
  Equals,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Min,
  MinLength,
} from 'class-validator';
import { isMatch } from 'lodash';

export class CreateDto {
  @IsEmail({}, { message: '유효한 이메일을 입력해주세요.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상입니다.' })
  password: string;

  //checkPassword
  @IsString()
  @IsNotEmpty({ message: '확인 비밀번호를 입력해주세요.' })
  // @Equals('password', {
  //   message: '비밀번호와 확인 비밀번호가 일치하지 않습니다.',
  // })
  passwordConfirm: string;

  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  name: string;
}
