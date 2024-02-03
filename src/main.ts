import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerInit } from './infrastructure/common/swagger/swagger';
import { ControllersModule } from '@infrastructure/controllers/controllers.module';
import { Logger } from '@nestjs/common';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { GLOBAL_PREFIX } from './constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });
  app.setGlobalPrefix(GLOBAL_PREFIX);

  SwaggerInit(app, [ControllersModule]);

  const configService = app.get(EnvironmentConfigService);

  const PORT = configService.getPort();
  await app.listen(PORT);

  const appUrl = await app.getUrl();

  Logger.log(`app is running on ${appUrl}`, 'NestApplication');
}

bootstrap();
