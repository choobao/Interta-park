import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user ? request.user : null;
  },
);
//커스텀 데코레이터 UserInfo
//ctx.switchToHttp().getRequest() 메소드를 통해 req에 접근한다.
//로그인 되어있을시 user를 리턴하고 아닐시 null
