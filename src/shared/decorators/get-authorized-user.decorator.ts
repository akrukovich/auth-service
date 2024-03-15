import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../../users/entities/user.entity';

export const GetAuthorizedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as UserEntity;
  },
);
