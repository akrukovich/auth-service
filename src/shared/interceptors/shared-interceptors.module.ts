import { Module } from '@nestjs/common';
import { LoggingExecutionTimeInterceptor } from './logging-execution-time.interceptor';

@Module({
  providers: [LoggingExecutionTimeInterceptor],
  exports: [LoggingExecutionTimeInterceptor],
})
export class SharedInterceptorsModule {}
