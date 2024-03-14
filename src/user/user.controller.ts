import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateDto } from './dto/create.dto';
import { UserInfo } from 'src/utils/userInfo.decoreator';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { LevelGuard } from 'src/level/level.guard';
import { IsAdminDto } from './dto/isAdmin.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createDto: CreateDto, @Res() res) {
    const createUser = await this.userService.register(
      createDto.email,
      createDto.password,
      createDto.passwordConfirm,
      createDto.name,
    );

    res.status(201).json({ message: '회원가입이 완료 되었습니다.' });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res) {
    const user = await this.userService.login(
      loginDto.email,
      loginDto.password,
    );
    res.cookie('authorization', `Bearer ${user.accessToken}`);
    res.cookie('refreshToken', `Bearer ${user.refreshToken}`);

    res.send('로그인에 성공하였습니다.');
  }

  //관계자 등록
  @UseGuards(AuthGuard('jwt'))
  @Post('admin')
  async Admin(
    @UserInfo() user: User,
    @Body() AdminDto: IsAdminDto,
    @Res() res,
  ) {
    const Admin = await this.userService.isAdmin(
      user.id,
      AdminDto.AdminPassword,
    );

    res.send('관계자 등록이 완료되었습니다.');
  }

  //유저 정보 가져오기
  @UseGuards(AuthGuard('jwt'))
  @Get('userInfo')
  async userInfo(@UserInfo() user: User) {
    const userInfo = await this.userService.userInfo(
      user.id,
      user.email,
      user.name,
      user.role,
    );
    return userInfo;
  }
}
