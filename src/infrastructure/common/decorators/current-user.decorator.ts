import { IJwtServicePayload } from '@domain/adapters/jwt.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CurrentUserAccount = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as unknown as Request;
    const payload = request['user'] as IJwtServicePayload;
    return payload
  },
);
