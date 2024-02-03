import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthService {
  public verifyIdToken(
    idToken: string,
    checkRevoked?: boolean,
  ): Promise<admin.auth.DecodedIdToken> {
    return admin.auth().verifyIdToken(idToken, checkRevoked);
  }
}
