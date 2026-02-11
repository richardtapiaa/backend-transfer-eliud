
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

// entidad de usuario
import { Usuario } from '../modules/usuarios/entities/usuario.entidad';

// entidad de reserva
import { Reserva } from '../modules/reservas/entities/reserva.entidad';

// entidad de token de notificacion
import { TokenNotificacion } from '../modules/notificaciones/entities/token-notificacion.entidad';


// entidad de notificacion
import { Notificacion } from '../modules/notificaciones/entities/notificacion.entidad';


@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [Usuario, Reserva, TokenNotificacion, Notificacion],
        synchronize: false,
      }),
    }),
  ],
})
export class DatabaseModule { }