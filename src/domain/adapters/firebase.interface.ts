import * as admin from 'firebase-admin';

export interface IFirebaseAuthService {
  verifyIdToken(
    idToken: string,
    checkRevoked?: boolean,
  ): Promise<admin.auth.DecodedIdToken>;
}
