import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Point } from './entities/point.entity';
import { compare, hash, hashSync } from 'bcrypt';
import _ from 'lodash';
import { Role } from './types/userRole.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,
    private readonly jwtService: JwtService,
  ) {}

  //회원가입
  async register(
    email: string,
    password: string,
    passwordConfirm: string,
    name: string,
  ) {
    if (password != passwordConfirm) {
      throw new ConflictException('비밀번호와 비밀번호 확인은 같아야합니다.');
    }

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입된 사용자가 있습니다.',
      );
    }

    const hashedPassword = await hash(password, 10);

    const user = await this.userRepository.save({
      email,
      password: hashedPassword,
      name,
    });

    const point = await this.pointRepository.save({
      user,
      point: 1000000,
      content: '회원가입 특별 이벤트 포인트',
    });
  }

  //로그인
  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    });

    if (_.isNil(user)) {
      throw new NotFoundException('이메일을 확인해주세요.');
    }

    if (!(await compare(password, user.password))) {
      throw new NotFoundException('비밀번호를 확인해주세요.');
    }

    const payload = { email, sub: user.id };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '12h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  //내 정보 조회
  async userInfo(id: number, email: string, name: string, role: boolean) {
    //유저 아이디
    const user = await this.userRepository.findOne({
      // select: ['id', 'email', 'name', 'role', 'point'],
      where: { email },
    });

    const point = await this.pointRepository.findOne({
      where: { userId: id },
      select: ['point'],
    });

    return { user, point };
  }

  //공연관계자 등록
  async isAdmin(id: number, AdminPassword: string) {
    const AdPassword = '공연 관계자입니다.';
    if (AdminPassword != AdPassword) {
      throw new NotFoundException('관계자 비밀번호가 틀렸습니다.');
    }

    const Admin = await this.userRepository.save({
      id,
      role: true,
    });
    console.log(Admin);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
