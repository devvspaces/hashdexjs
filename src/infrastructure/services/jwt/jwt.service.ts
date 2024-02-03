import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IJwtService,
  IJwtServicePayload,
} from '../../../domain/adapters/jwt.interface';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async validateToken<T extends object = IJwtServicePayload>(
    token: string,
    secret?: string,
  ) {
    const decode = await this.jwtService.verifyAsync<T>(token, {
      secret,
    });
    return decode;
  }

  async signPayload(
    payload: IJwtServicePayload,
    secret?: string,
    expiresIn?: string,
  ) {
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }
}
