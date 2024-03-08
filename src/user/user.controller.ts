// import { UserInfo } from 'src/utils/userInfo.decorator';

import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CreateDto } from './dto/create.dto';

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

    res.cookie('authorization', `Bearer ${user.access_token}`);
    // res.cookie('refreshToken', user.refreshToken)
    res.send('로그인에 성공하였습니다.');
  }

  //   @UseGuards(AuthGuard('jwt'))
  //   @Get('email')
  //   getEmail(@UserInfo() user: User) {
  //     return { email: user.email };
  //   }
}
