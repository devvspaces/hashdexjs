import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
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
  IsUserPresenter,
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
  @HttpCode(200)
  async login(@Body() auth: AuthLoginDto) {
    const {name, photo, pat, tokens} = await this.loginUsecaseProxy
      .getInstance()
      .authenticate(auth.token);
    return new IsAuthPresenter({
      tokens,
      name,
      photo,
      pat
    });
  }

  @Post('set-hashnode-account')
  @ApiBody({ type: SetHashnodeDto })
  @ApiBearerAuth()
  @HttpCode(200)
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

  @Get('profile')
  @ApiOperation({
    summary: 'Create / login a new user',
    description: 'Use this route to log in a user',
  })
  @ApiOkResponse({
    description: 'The user was logged in successfully',
    type: IsUserPresenter,
  })
  @HttpCode(200)
  async profile(@CurrentUserAccount() payload: IJwtServicePayload) {
    const user = await this.loginUsecaseProxy
      .getInstance()
      .getUser(payload.id);
    console.log(user)
    return new IsUserPresenter({
      name: user.name,
      photo: user.photo,
      pat: user.hashnodePat,
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
  @HttpCode(200)
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
