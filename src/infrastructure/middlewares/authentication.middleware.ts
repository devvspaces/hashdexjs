/* eslint-disable @typescript-eslint/no-namespace */
import { IJwtServicePayload } from '@domain/adapters/jwt.interface';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { UseCaseProxy } from '@infrastructure/usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { LoginUseCases } from '@usecases/auth/login.usecases';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: IJwtServicePayload;
    }
  }
}

/**
 * This middleware checks if the user is authenticated with a valid token.
 */
@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  private logger = new LoggerService(AuthenticationMiddleware.name);

  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
    private readonly exceptions: ExceptionsService,
  ) {}

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  public async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      this.exceptions.unauthorizedException({
        message: 'Unauthorized',
      });
    }

    try {
      const payload = await this.loginUsecaseProxy
        .getInstance()
        .validateAccessToken(token);
      req.user = payload;
      return next();
    } catch (error) {
      this.logger.error(error);
      const message = error.message || 'Unauthorized';
      const status = error.status || 401;
      this.exceptions.unauthorizedException({
        message,
        code_error: status,
      });
    }
  }
}
