import { OmitType } from '@nestjs/mapped-types';

import { CreateDto } from './create.dto';

export class LoginDto extends OmitType(CreateDto, [
  'name',
  'passwordConfirm',
]) {}
//OmitType을 이용해 name, passwordConfirm을 제외하고 CrateDto에서 가져오도록
