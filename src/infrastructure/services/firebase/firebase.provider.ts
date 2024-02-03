import * as admin from 'firebase-admin';
import * as ServiceAccount from '@infrastructure/config/firebase/ServiceAccount.json';

export const FIREBASE = Symbol('FIREBASE');

export const FirebaseProvider = {
  provide: FIREBASE,
  useFactory: () => {
    return admin.initializeApp({
      credential: admin.credential.cert(ServiceAccount),
    });
  },
};
