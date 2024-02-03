import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({ required: true, description: 'firebase idToken' })
  @IsNotEmpty()
  @IsString()

  readonly token: string;
}

export class SetHashnodeDto {
  @ApiProperty({ required: true, description: 'hashnode pat' })
  @IsNotEmpty()
  @IsString()

  readonly pat: string;
}

export class RefreshDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly refreshToken: string;
}
