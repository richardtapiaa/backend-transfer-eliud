import * as admin from 'firebase-admin';
import * as path from 'path';

export const firebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    if (!admin.apps.length) {
      
      if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        });
      }
     
      else {
        const serviceAccountPath = path.join(
          __dirname,
          '../../../firebase-admin.json'
        );

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath),
        });
      }
    }
    return admin;
  },
};