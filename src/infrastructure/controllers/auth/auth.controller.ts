import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthLoginDto, RefreshDto, SetHashnodeDto } from './auth-dto.class';
import {
  IsAuthPresenter,
  RefreshedAccessTokenPresenter,
} from './auth.presenter';

import JwtRefreshGuard from '../../common/guards/jwtRefresh.guard';

import { UseCaseProxy } from '../../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../../usecases-proxy/usecases-proxy.module';
import { LoginUseCases } from '../../../usecases/auth/login.usecases';
import { ApiHeaders } from '@infrastructure/common/decorators/api.decorator';
import { CurrentUserAccount } from '@infrastructure/common/decorators/current-user.decorator';
import { IJwtServicePayload } from '@domain/adapters/jwt.interface';
import { MessagePresenter } from '@infrastructure/common/presenters/message.presenter';

@Controller('auth')
@ApiTags('Authentication')
@UseInterceptors(ClassSerializerInterceptor)
@ApiHeaders()
export class AuthController {
  constructor(
    @Inject(UsecasesProxyModule.LOGIN_USECASES_PROXY)
    private readonly loginUsecaseProxy: UseCaseProxy<LoginUseCases>,
  ) {}

  @Post('login')
  @ApiBody({ type: AuthLoginDto })
  @ApiOperation({
    summary: 'Create / login a new user',
    description: 'Use this route to log in a user',
  })
  @ApiOkResponse({
    description: 'The user was logged in successfully',
    type: IsAuthPresenter,
  })
  async login(@Body() auth: AuthLoginDto) {
    const {name, photo, pat, tokens} = await this.loginUsecaseProxy
      .getInstance()
      .authenticate(auth.token);
    return new IsAuthPresenter({
      tokens,
      name,
      photo
    });
  }

  @Post('set-hashnode-account')
  @UseGuards(JwtRefreshGuard)
  @ApiBody({ type: SetHashnodeDto })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'The user was logged in successfully',
    type: MessagePresenter,
  })
  async completeSetup(
    @CurrentUserAccount() payload: IJwtServicePayload,
    @Body() data: SetHashnodeDto
  ) {
    const user = await this.loginUsecaseProxy
    .getInstance()
    .setHashnodePat(payload.id, data.pat);
    return new MessagePresenter({
      message: 'Hashnode account was connected successfully'
    });
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  @ApiBody({ type: RefreshDto })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refreshes the access token',
    description: 'Use this route to refresh the access token',
  })
  @ApiOkResponse({
    description: 'The access token was refreshed successfully',
    type: RefreshedAccessTokenPresenter,
  })
  async refresh(@Body() auth: RefreshDto) {
    const payload = await this.loginUsecaseProxy
      .getInstance()
      .validateRefreshToken(auth.refreshToken);
    const access = await this.loginUsecaseProxy
      .getInstance()
      .getAccessToken(payload.id);
    return new RefreshedAccessTokenPresenter(access);
  }
}
