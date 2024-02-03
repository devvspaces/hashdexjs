import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTConfig } from '../../../domain/config/jwt.interface';
import { RedisConfig } from '@domain/config/redis.interface';
import {
  Environment,
  EnvironmentConfig,
} from '@domain/config/enviroment.interface';

@Injectable()
export class EnvironmentConfigService
  implements JWTConfig, RedisConfig, EnvironmentConfig
{
  constructor(private configService: ConfigService) {}

  getEnvironment(): Environment {
    return this.configService.get<Environment>('NODE_ENV');
  }

  getApiKey(): string {
    return this.configService.get<string>('API_KEY');
  }

  getAppName(): string {
    return this.configService.get<string>('APP_NAME');
  }

  getPort(): number {
    return this.configService.get<number>('PORT');
  }

  getDefaultAdmin() {
    return {
      username: this.configService.get<string>('DEFAULT_ADMIN_USERNAME'),
      password: this.configService.get<string>('DEFAULT_ADMIN_PASSWORD'),
    };
  }

  getSwaggerRoute(): string {
    return this.configService.get<string>('SWAGGER_ROUTE');
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION_TIME');
  }

  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET');
  }

  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME');
  }

  getRedisHost(): string {
    return this.configService.get<string>('REDIS_HOST');
  }

  getRedisPort(): number {
    return this.configService.get<number>('REDIS_PORT');
  }

  getRedisPassword(): string {
    return this.configService.get<string>('REDIS_PASSWORD');
  }

  getRedisDB(): number {
    return this.configService.get<number>('REDIS_DB');
  }

  getRedisConnectionUrl(): string {
    const redisHost = this.getRedisHost();
    const redisPort = this.getRedisPort();
    const redisPassword = this.getRedisPassword();
    const redisDB = this.getRedisDB();
    if (redisPassword) {
      return `redis://${redisPassword}@${redisHost}:${redisPort}/${redisDB}`;
    }
    return `redis://${redisHost}:${redisPort}/${redisDB}`;
  }
}
