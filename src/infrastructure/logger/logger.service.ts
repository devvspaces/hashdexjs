import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from '../../domain/logger/logger.interface';

@Injectable()
export class LoggerService extends Logger implements ILogger {
  context: string;

  constructor(context?: string) {
    super(context);
    this.context = context;
  }

  setContext(context: string) {
    this.context = context;
  }
  debug(message: any, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(`[DEBUG] ${message}`, context || this.context);
    }
  }
  log(message: any, context?: string) {
    super.log(`[INFO] ${message}`, context || this.context);
  }
  error(message: any, trace?: string, context?: string) {
    super.error(`[ERROR] ${message}`, trace, context || this.context);
  }
  warn(message: any, context?: string) {
    super.warn(`[WARN] ${message}`, context || this.context);
  }
  verbose(message: any, context?: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.verbose(`[VERBOSE] ${message}`, context || this.context);
    }
  }
}
