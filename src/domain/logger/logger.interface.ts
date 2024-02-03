export interface ILogger {
  context: string;
  setContext(context: string): void;
  debug(message: any, context?: string): void;
  log(message: any, context?: string): void;
  error(message: any, trace?: string, context?: string): void;
  warn(message: any, context?: string): void;
  verbose(message: any, context?: string): void;
}
