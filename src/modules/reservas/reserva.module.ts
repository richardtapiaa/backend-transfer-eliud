import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// controlador de reservas
import { ReservaController } from './reserva.controller';

// logica de reservas
import { ReservaService } from './reserva.service';

// entidad de reservas
import { Reserva } from './entities/reserva.entidad';

// modulo de notificaciones
import { NotificacionesModule } from '../notificaciones/notificaciones.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Reserva]),
    NotificacionesModule,
  ],
  controllers: [ReservaController],
  providers: [ReservaService],
  exports: [ReservaService],
})
export class ReservaModule {}
