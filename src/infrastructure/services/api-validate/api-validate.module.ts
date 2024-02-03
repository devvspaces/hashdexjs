import { Module } from '@nestjs/common';
import { ApiKeyValidateService } from './api-validate.service';

@Module({
  providers: [ApiKeyValidateService],
  exports: [ApiKeyValidateService],
})
export class ApiKeyValidateModule {}
