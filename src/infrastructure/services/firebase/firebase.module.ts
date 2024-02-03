import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './firebase.service';
import { FirebaseProvider } from './firebase.provider';

@Module({
  providers: [FirebaseAuthService, FirebaseProvider],
  exports: [FirebaseAuthService, FirebaseProvider],
})
export class FirebaseAuthModule {}
