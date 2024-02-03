import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { INestApplication } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

export function SwaggerInit(
  app: INestApplication,
  // eslint-disable-next-line @typescript-eslint/ban-types
  modules?: Function[],
) {
  const configService = app.get(EnvironmentConfigService);

  const NODE_ENV = configService.getEnvironment();

  const APP_NAME = configService.getAppName();

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(APP_NAME)
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('Api')
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: APP_NAME,
    useGlobalPrefix: false,
  };

  const document = SwaggerModule.createDocument(app, config, {
    include: modules,
    operationIdFactory: (_controllerKey, methodKey) => methodKey,
  });
  const swaggerRoute = configService.getSwaggerRoute();

  if (NODE_ENV != 'development') {
    const admin = configService.getDefaultAdmin();

    app.use(
      swaggerRoute,
      basicAuth({
        challenge: true,
        users: { [admin.username]: admin.password },
      }),
    );

    SwaggerModule.setup(swaggerRoute, app, document, customOptions);
    return;
  }

  SwaggerModule.setup(swaggerRoute, app, document, customOptions);
}
