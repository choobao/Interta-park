import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Point } from './entities/point.entity';
import { compare, hash, hashSync } from 'bcrypt';
import _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    @InjectRepository(Point)
    private readonly userRepository: Repository<User>,
    private readonly pointRepository: Repository<Point>,
    private readonly jwtService: JwtService,
  ) {}

  //회원가입
  async register(email: string, password: string, name: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다.',
      );
    }

    const hashedPassword = await hash(password, 10);
    await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
    });
  }

  //로그인
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  //공연관계자 등록

  //내 정보 조회

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
