import { Module } from '@nestjs/common';
import { UserRepositoryImp } from './user.repository';
import { DatabaseModule } from '@infrastructure/config/prisma/prisma.module';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepositoryImp],
  exports: [UserRepositoryImp],
})
export class RepositoriesModule {}
