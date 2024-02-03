/* eslint-disable @typescript-eslint/no-namespace */
import { API_KEY_HEADER } from '@infrastructure/common/decorators/api.decorator';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { LoggerService } from '@infrastructure/logger/logger.service';
import { ApiKeyValidateService } from '@infrastructure/services/api-validate/api-validate.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * This middleware checks if the API Key is valid
 */
@Injectable()
export class ApiMiddleware implements NestMiddleware {
  private logger = new LoggerService(ApiMiddleware.name);

  constructor(
    private readonly validateService: ApiKeyValidateService,
    private readonly exceptions: ExceptionsService,
  ) {}

  private extractApiKeyFromHeader(request: Request): string | undefined {
    return (request.headers[API_KEY_HEADER] as string) || undefined;
  }

  public async use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('Validating API Key');
    const key = this.extractApiKeyFromHeader(req);
    if (!key) {
      this.exceptions.unauthorizedException({
        message: 'Unauthorized access',
      });
    }

    if ((await this.validateService.isValid(key)) == false) {
      this.exceptions.unauthorizedException({
        message: 'Invalid API Key',
      });
    }

    this.logger.debug('API Key is valid');
    return next();
  }
}
