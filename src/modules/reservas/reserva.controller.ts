import { Controller, Get, Post, Patch, Body, Param, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';

import { ReservaService } from './reserva.service';
import { CrearReservaDto } from './dto/crear-reserva.dto';
import { Reserva } from './entities/reserva.entidad';
import { ReservaEstado } from './enums/reseva-estado';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) { }


  // crear una nueva reserva - PÚBLICO (para formulario web)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 1800000 } })
  @Post()
  async crear(@Body() crearReservaDto: CrearReservaDto): Promise<Reserva> {
    try {
      return await this.reservaService.crear(crearReservaDto);
    } catch (error) {
      throw new HttpException(
        'Error al crear la reserva',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  // obtener todas las reservas con filtros opcionales - PROTEGIDO (solo admin)
  @Get()
  @UseGuards(JwtAuthGuard)
  async obtenerTodas(
    @Query('buscar') buscar?: string,
    @Query('estado') estado?: ReservaEstado,
  ): Promise<Reserva[]> {
    try {

      if (buscar) {
        return await this.reservaService.buscar(buscar, estado);
      }


      if (estado) {
        return await this.reservaService.obtenerPorEstado(estado);
      }


      return await this.reservaService.obtenerTodas();
    } catch (error) {
      throw new HttpException(
        'Error al obtener las reservas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  // obtener una reserva por id - PROTEGIDO (solo admin)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async obtenerPorId(@Param('id') id: string): Promise<Reserva> {
    try {
      const reserva = await this.reservaService.obtenerPorId(id);

      if (!reserva) {
        throw new HttpException(
          'Reserva no encontrada',
          HttpStatus.NOT_FOUND,
        );
      }

      return reserva;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener la reserva',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  // Aceptar una reserva (cambiar estado a CONFIRMADA) - PROTEGIDO (solo admin)
  @Patch(':id/aceptar')
  @UseGuards(JwtAuthGuard)
  async aceptarReserva(@Param('id') id: string): Promise<Reserva> {
    try {
      return await this.reservaService.aceptarReserva(id);
    } catch (error) {
      if (error.message.includes('no encontrada')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('ya ha sido')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Error al aceptar la reserva',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Rechazar una reserva (cambiar estado a RECHAZADA) - PROTEGIDO (solo admin)
  @Patch(':id/rechazar')
  @UseGuards(JwtAuthGuard)
  async rechazarReserva(@Param('id') id: string): Promise<Reserva> {
    try {
      return await this.reservaService.rechazarReserva(id);
    } catch (error) {
      if (error.message.includes('no encontrada')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('ya ha sido')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Error al rechazar la reserva',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Actualizar una reserva (editar campos) - PROTEGIDO (solo admin)
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async actualizar(@Param('id') id: string, @Body() updateReservaDto: any): Promise<Reserva> {
    try {
      return await this.reservaService.actualizar(id, updateReservaDto);
    } catch (error) {
      if (error.message.includes('No encontrada')) {
        throw new HttpException('Reserva no encontrada', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al actualizar la reserva',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
