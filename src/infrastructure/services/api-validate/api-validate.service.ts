import { Injectable } from '@nestjs/common';
import { IApiKeyValidateService } from '@domain/adapters/api-key-validate.interface';
import { EnvironmentConfigService } from '@infrastructure/config/environment-config/environment-config.service';

@Injectable()
export class ApiKeyValidateService implements IApiKeyValidateService {
  constructor(
    private readonly enviroment: EnvironmentConfigService,
  ) {}

  async isValid(key: string): Promise<boolean> {
    return this.enviroment.getApiKey() == key;
  }
}
