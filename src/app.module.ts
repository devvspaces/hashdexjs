import { AuthenticationMiddleware } from '@infrastructure/middlewares/authentication.middleware';
import { EnvironmentConfigModule } from '@infrastructure/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';
import { ControllersModule } from '@infrastructure/controllers/controllers.module';
import { ExceptionsModule } from '@infrastructure/exceptions/exceptions.module';
import { LoggerModule } from '@infrastructure/logger/logger.module';
import { JwtServiceModule } from '@infrastructure/services/jwt/jwt.module';
import { UsecasesProxyModule } from '@infrastructure/usecases-proxy/usecases-proxy.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import {
  Module,
  MiddlewareConsumer,
  ValidationPipe,
  RequestMethod,
} from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-store';
import { ApiKeyValidateModule } from '@infrastructure/services/api-validate/api-validate.module';
import { ApiMiddleware } from '@infrastructure/middlewares/apikey.middleware';
import { FirebaseAuthModule } from '@infrastructure/services/firebase/firebase.module';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: async (config: EnvironmentConfigService) => {
        return {
          store: (await redisStore({
            url: config.getRedisConnectionUrl(),
          })) as unknown as CacheStore,
        };
      },
    }),
    ControllersModule,
    JwtServiceModule,
    FirebaseAuthModule,
    EnvironmentConfigModule,
    ApiKeyValidateModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
        errorHttpStatusCode: 400,
        stopAtFirstError: true,
      }),
    },
  ],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        {
        path: 'auth/refresh',
        method: RequestMethod.POST,
      },
      {
        path: 'auth/login',
        method: RequestMethod.POST,
      })
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });

    consumer.apply(ApiMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
