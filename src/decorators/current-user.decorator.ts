import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDocument } from 'src/modules/users/schemas/users.schema';

export const CurrentUser = createParamDecorator(
  (data: string, ctx: ExecutionContext): UserDocument | null => {
    const user = ctx.switchToHttp().getRequest().user;
    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);