import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { LoggerService } from './logger/logger.service';
import { LoggingExecutionTimeInterceptor } from './shared/interceptors/logging-execution-time.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const logger = app.get(LoggerService);
  app.useGlobalInterceptors(new LoggingExecutionTimeInterceptor(logger));

  const configService = app.get(ConfigService);
  const port = configService.getEnvConfigService().getPort();

  const config = new DocumentBuilder().setTitle('Auth Service').addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}

bootstrap();
