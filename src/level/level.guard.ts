import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class LevelGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(request);

    if (user && user.role === true) {
      return true;
    }
    throw new ForbiddenException('접근이 금지되었습니다!');
  }
}
//canActivate 메서드에서 HTTp 요청 객체를 통해 사용자 정보를 가져옴
//user가 존재하고 && role이 true일 경우에만 접근 가능
