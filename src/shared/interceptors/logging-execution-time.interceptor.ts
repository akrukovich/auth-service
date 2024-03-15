import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggingExecutionTimeInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const now = Date.now();
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    return next.handle().pipe(
      tap(() => {
        const response = ctx.getResponse();
        const executionTime = Date.now() - now;
        this.logger.log(
          `${request.method} ${request.originalUrl} [${response.statusCode}] - ${executionTime}ms`,
        );
      }),
    );
  }
}
