import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

// modulo de base de datos
import { DatabaseModule } from './database/database.module';

// modulo de autenticacion
import { AuthModule } from './modules/auth/auth.module';

// modulo de usuarios
import { UsuarioModule } from './modules/usuarios/usuario.module';

// modulo de reservas
import { ReservaModule } from './modules/reservas/reserva.module';

// modulo de notificaciones
import { NotificacionesModule } from './modules/notificaciones/notificaciones.module';

// modulo de firebase
import { firebaseAdminProvider } from './modules/firebase/firebase.provider';


// modulo de email
import { EmailModule } from './modules/email/email.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1800000, // 30 minutos en milisegundos
        limit: 1, // 1 solicitud por TTL
      },
    ]),
    DatabaseModule,
    AuthModule,
    UsuarioModule,
    ReservaModule,
    NotificacionesModule,
    EmailModule,
  ],
  controllers: [],
  providers: [
    firebaseAdminProvider,
  ],
})
export class AppModule { }

