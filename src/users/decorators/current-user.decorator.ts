import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { CURRENT_USER_KEY } from '../../utlis/constants';
import { JWTPayloadType } from '../../utlis/types';
//current user parameter decorator
//it returns the payload that include type and token
export const CurrentUser = createParamDecorator(
  (data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payload: JWTPayloadType = request[CURRENT_USER_KEY];
    return payload;
  },
);
