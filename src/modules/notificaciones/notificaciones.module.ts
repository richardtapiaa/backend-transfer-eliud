import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// controlador de notificaciones
import { NotificacionesController } from './notificaciones.controller';

// servicio de notificaciones
import { NotificacionesService } from './notificaciones.service';


// proveedor de firebase
import { firebaseAdminProvider } from '../firebase/firebase.provider';


// entidad de token de notificación y notificación
import { TokenNotificacion } from './entities/token-notificacion.entidad';
import { Notificacion } from './entities/notificacion.entidad';

@Module({
  imports: [TypeOrmModule.forFeature([TokenNotificacion, Notificacion])],
  controllers: [NotificacionesController],
  providers: [NotificacionesService, firebaseAdminProvider],
  exports: [NotificacionesService],
})
export class NotificacionesModule { }