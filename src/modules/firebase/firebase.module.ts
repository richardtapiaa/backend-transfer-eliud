import { Module, Global } from '@nestjs/common';
import { firebaseAdminProvider } from './firebase.provider';

@Global()
@Module({
  providers: [firebaseAdminProvider],
  exports: [firebaseAdminProvider],
})
export class FirebaseModule {}