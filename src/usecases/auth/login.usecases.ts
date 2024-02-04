import { ExceptionsService } from '@infrastructure/exceptions/exceptions.service';
import {
  IJwtService,
  IJwtServicePayload,
  TokenType,
} from '../../domain/adapters/jwt.interface';
import { JWTConfig } from '../../domain/config/jwt.interface';
import { ILogger } from '../../domain/logger/logger.interface';
import { UserRepository } from '../../domain/repositories/userRepository.interface';
import { FirebaseAuthService } from '@infrastructure/services/firebase/firebase.service';

export class LoginUseCases {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtTokenService: IJwtService,
    private readonly jwtConfig: JWTConfig,
    private readonly userRepository: UserRepository,
    private readonly exception: ExceptionsService,
    private readonly firebase: FirebaseAuthService,
  ) {
    this.logger.setContext(LoginUseCases.name);
  }

  async authenticate(token: string) {
    try {
      const decoded = await this.firebase.verifyIdToken(token)
      const { email, email_verified, picture, name } = decoded;

      if (!email_verified) {
        this.logger.error('===> UNVERIFIED GOOGLE ACCOUNT <===');
        this.exception.badRequestException({
          message: 'Cannot sign up account with an unverified email'
        });
      }

      let exists = await this.userRepository.getUserByEmail(email);
      if (!exists) {
        exists = await this.userRepository.createUser({
          email,
          isEmailVerified: email_verified,
          photo: picture,
          name: name ?? email.split('@')[0],
          lastLogin: new Date(),
        })
      }

      const accessToken = await this.getAccessToken(exists.id);
      const refresh = await this.jwtTokenService.signPayload(
        {
          id: exists.id,
          type: TokenType.REFRESH,
        },
        this.jwtConfig.getJwtRefreshSecret(),
        this.jwtConfig.getJwtRefreshExpirationTime(),
      );
      const tokens = {
        ...accessToken,
        refresh,
        refreshExpiresIn: this.jwtConfig.getJwtRefreshExpirationTime(),
      };
      return {
        name: exists.name,
        photo: exists.photo,
        tokens,
        pat: exists.hashnodePat
      }
    } catch (error) {
      console.error(error);
      this.logger.error(error);
      this.exception.badRequestException({
        message: 'Id token is invalid'
      });
    }
  }

  async getUser(id: string) {
    let exists = await this.userRepository.getUser(id);
    if (!exists) {
      this.exception.unauthorizedException({
        'message': 'You are not authorized access this resource'
      })
    }
    return exists
  }

  async setHashnodePat(id: string, pat: string) {
    let exists = await this.userRepository.setHashnodePat(id, pat);
    if (!exists) {
      this.exception.unauthorizedException({
        'message': 'You are not authorized access this resource'
      })
    }
    return exists
  }

  async getAccessToken(id: string) {
    const accessTokenPayload: IJwtServicePayload = {
      id,
      type: TokenType.ACCESS,
    };
    const access = await this.jwtTokenService.signPayload(accessTokenPayload, this.jwtConfig.getJwtSecret(), this.jwtConfig.getJwtExpirationTime() );
    return {
      access,
      accessExpiresIn: this.jwtConfig.getJwtExpirationTime(),
    };
  }

  async validateAccessToken(access: string) {
    const payload = await this.jwtTokenService.validateToken(access);
    if (payload.type !== TokenType.ACCESS) {
      throw new Error('Invalid token');
    }
    return payload;
  }

  async validateRefreshToken(refresh: string) {
    const payload = await this.jwtTokenService.validateToken(
      refresh,
      this.jwtConfig.getJwtRefreshSecret(),
    );
    if (payload.type !== TokenType.REFRESH) {
      throw new Error('Invalid token');
    }
    return payload;
  }

  async updateLoginTime(username: string) {
    await this.userRepository.updateLastLogin(username);
  }
}
