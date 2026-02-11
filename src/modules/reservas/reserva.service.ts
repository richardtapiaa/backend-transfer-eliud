import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';


import { Reserva } from './entities/reserva.entidad';
import { CrearReservaDto } from './dto/crear-reserva.dto';
import { ReservaEstado } from './enums/reseva-estado';


// service de notificaciones integrado a reservas (para enviar notificaciones a los administradores)
import { NotificacionesService } from '../notificaciones/notificaciones.service';



@Injectable()
export class ReservaService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    private readonly notificacionesService: NotificacionesService,
  ) { }




  // funcion para crear una reserva nueva.
  async crear(crearReservaDto: CrearReservaDto): Promise<Reserva> {
    const nuevaReserva = this.reservaRepository.create({
      nombre: crearReservaDto.nombre,
      telefono: crearReservaDto.telefono,
      correoElectronico: crearReservaDto.correoElectronico,
      fechaHoraServicio: new Date(crearReservaDto.fechaHoraServicio),
      lugarRecogida: crearReservaDto.lugarRecogida,
      destino: crearReservaDto.destino,
      cantidadPersonas: crearReservaDto.cantidadPersonas,
      // Si es desde admin, se crea como CONFIRMADA, sino como PENDIENTE
      estado: crearReservaDto.desdeAdmin ? ReservaEstado.CONFIRMADA : ReservaEstado.PENDIENTE,
      monto: crearReservaDto.monto,
      comision: crearReservaDto.comision,
      chofer: crearReservaDto.chofer,
      vuelo: crearReservaDto.vuelo,
      mensaje: crearReservaDto.mensaje,
    });



    const reservaGuardada = await this.reservaRepository.save(nuevaReserva);

    // Enviar notificación push a administradores solo si NO es desde el panel admin
    if (!crearReservaDto.desdeAdmin) {
      const fecha = new Date(crearReservaDto.fechaHoraServicio);
      const fechaFormateada = fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

      await this.notificacionesService.enviarNotificacionAdmin(
        'Solicitud de Reserva', // Título
        `Solicitud de ${crearReservaDto.nombre}. Destino: ${crearReservaDto.destino}. Fecha: ${fechaFormateada}`, // Mensaje para Historial (DB)
        {
          reservaId: reservaGuardada.id,
          nombre: crearReservaDto.nombre,
          destino: crearReservaDto.destino,
        },
        'https://lh3.googleusercontent.com/d/1rds2mbnjmD_wBMiVd94lBLRBKpHqXN2T', // URL Imagen
        'Se ha recibido una nueva solicitud de reserva' // Mensaje para PUSH (Simple)
      );
    }

    return reservaGuardada;
  }






  // obtener todas las reservas
  async obtenerTodas(): Promise<Reserva[]> {
    return await this.reservaRepository.find({
      order: {
        fechaCreacion: 'DESC',
      },
    });
  }


  // buscar reservas por término de búsqueda
  async buscar(termino: string, estado?: ReservaEstado): Promise<Reserva[]> {
    const whereConditions: any = [];

    // Buscar en múltiples campos
    whereConditions.push({ nombre: ILike(`%${termino}%`) });
    whereConditions.push({ telefono: ILike(`%${termino}%`) });
    whereConditions.push({ correoElectronico: ILike(`%${termino}%`) });
    whereConditions.push({ lugarRecogida: ILike(`%${termino}%`) });
    whereConditions.push({ destino: ILike(`%${termino}%`) });

    // Si hay un estado específico, agregarlo a cada condición
    if (estado) {
      whereConditions.forEach((condition: any) => {
        condition.estado = estado;
      });
    }

    return await this.reservaRepository.find({
      where: whereConditions,
      order: {
        fechaCreacion: 'DESC',
      },
    });
  }


  // obtener reservas por estado
  async obtenerPorEstado(estado: ReservaEstado): Promise<Reserva[]> {
    return await this.reservaRepository.find({
      where: { estado },
      order: {
        fechaCreacion: 'DESC',
      },
    });
  }


  // obtener una reserva por id
  async obtenerPorId(id: string): Promise<Reserva | null> {
    return await this.reservaRepository.findOne({
      where: { id },
    });
  }



  // Aceptar una reserva (cambiar estado a CONFIRMADA)
  async aceptarReserva(id: string): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reserva.estado !== ReservaEstado.PENDIENTE) {
      throw new Error(`La reserva ya ha sido ${reserva.estado.toLowerCase()}`);
    }

    reserva.estado = ReservaEstado.CONFIRMADA;
    return await this.reservaRepository.save(reserva);
  }



  // Rechazar una reserva (cambiar estado a RECHAZADA)
  async rechazarReserva(id: string): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reserva.estado !== ReservaEstado.PENDIENTE) {
      throw new Error(`La reserva ya ha sido ${reserva.estado.toLowerCase()}`);
    }

    reserva.estado = ReservaEstado.RECHAZADA;
    return await this.reservaRepository.save(reserva);
  }





  // Actualizar una reserva
  async actualizar(id: string, updateReservaDto: any): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    // Actualizar campos permitidos
    if (updateReservaDto.monto !== undefined) reserva.monto = updateReservaDto.monto;
    if (updateReservaDto.comision !== undefined) reserva.comision = updateReservaDto.comision;
    if (updateReservaDto.chofer !== undefined) reserva.chofer = updateReservaDto.chofer;
    if (updateReservaDto.vuelo !== undefined) reserva.vuelo = updateReservaDto.vuelo;

    if (updateReservaDto.nombre) reserva.nombre = updateReservaDto.nombre;
    if (updateReservaDto.telefono) reserva.telefono = updateReservaDto.telefono;
    if (updateReservaDto.destino) reserva.destino = updateReservaDto.destino;
    if (updateReservaDto.fechaHoraServicio) reserva.fechaHoraServicio = new Date(updateReservaDto.fechaHoraServicio);

    reserva.fechaActualizacion = new Date();

    return await this.reservaRepository.save(reserva);
  }
}






