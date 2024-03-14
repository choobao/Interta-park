import _ from 'lodash';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable() //다른곳에서도 주입해서 사용할수있도록 injectable
export class JwtStrategy extends PassportStrategy(Strategy) {
  //passportStrategy 상속시켜줌
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      //헤더에 토큰값 확인
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
      //jwt 토큰이 유효한지 확인
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.email);
    if (_.isNil(user)) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}
