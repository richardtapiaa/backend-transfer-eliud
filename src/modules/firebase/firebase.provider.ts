
import * as admin from 'firebase-admin'
import * as path from 'path'

export const firebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  useFactory: () => {
    if (!admin.apps.length) {
      const serviceAccountPath = path.join(__dirname, '../../../push-wep-app-firebase-admin.json')

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      })

    }
    return admin
  },
}
