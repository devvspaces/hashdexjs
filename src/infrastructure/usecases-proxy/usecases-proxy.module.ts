import { DynamicModule, Module } from '@nestjs/common';
import { LoginUseCases } from '../../usecases/auth/login.usecases';

import { ExceptionsModule } from '../exceptions/exceptions.module';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

import { JwtServiceModule } from '../services/jwt/jwt.module';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { RepositoriesModule } from '../repositories/repositories.module';

import { UserRepositoryImp } from '../repositories/user.repository';

import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { UseCaseProxy } from './usecases-proxy';
import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import { FirebaseAuthModule } from '@infrastructure/services/firebase/firebase.module';
import { FirebaseAuthService } from '@infrastructure/services/firebase/firebase.service';

@Module({
  imports: [
    LoggerModule,
    JwtServiceModule,
    FirebaseAuthModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
  ],
})
export class UsecasesProxyModule {
  // Auth
  static LOGIN_USECASES_PROXY = 'LoginUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [
            LoggerService,
            JwtTokenService,
            EnvironmentConfigService,
            UserRepositoryImp,
            ExceptionsService,
            FirebaseAuthService,
          ],
          provide: UsecasesProxyModule.LOGIN_USECASES_PROXY,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepo: UserRepositoryImp,
            exceptions: ExceptionsService,
            firebase: FirebaseAuthService,
          ) =>
            new UseCaseProxy(
              new LoginUseCases(
                logger,
                jwtTokenService,
                config,
                userRepo,
                exceptions,
                firebase,
              ),
            ),
        },
      ],
      exports: [UsecasesProxyModule.LOGIN_USECASES_PROXY],
    };
  }
}
