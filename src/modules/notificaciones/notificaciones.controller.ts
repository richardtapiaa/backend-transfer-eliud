import { Controller, Get, Post, Patch, Body, Param, HttpException, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { EnviarNotificacionDto } from './dto/enviar-notificacion.dto';
import { Reserva } from '../reservas/entities/reserva.entidad';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';


@Controller('notificaciones')
@UseGuards(JwtAuthGuard) // ⬅️ Protege TODAS las rutas de notificaciones
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) { }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async registrarToken(
    @Body() body: { token: string; userId: string; rol: string },
  ) {
    return await this.notificacionesService.registrarToken(
      body.token,
      body.userId,
      body.rol,
    );
  }

  @Get('tokens')
  async obtenerTokens() {
    return {
      tokens: await this.notificacionesService.obtenerTodosLosTokens(),
      cantidad: await this.notificacionesService.obtenerCantidadTokens(),
      tokensAdmin: await this.notificacionesService.obtenerTokensAdmin(),
    };
  }

  @Post('enviar')
  @HttpCode(HttpStatus.OK)
  async enviarNotificacion(
    @Body() body: { titulo: string; mensaje: string; datos?: any },
  ) {
    return await this.notificacionesService.enviarNotificacionAdmin(
      body.titulo,
      body.mensaje,
      body.datos,
    );
  }

  @Get()
  async obtenerHistorial() {
    return await this.notificacionesService.obtenerHistorial();
  }

  @Patch(':id/leer')
  async marcarComoLeida(@Param('id') id: string) {
    const exito = await this.notificacionesService.marcarComoLeida(id);
    return { success: exito };
  }
}