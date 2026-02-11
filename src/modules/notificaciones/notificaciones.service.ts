import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as admin from 'firebase-admin';
import { TokenNotificacion } from './entities/token-notificacion.entidad';
import { Notificacion } from './entities/notificacion.entidad';

export interface UsuarioToken {
  userId: string;
  token: string;
  rol: string;
}

@Injectable()


export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);


  constructor(
    @InjectRepository(TokenNotificacion)
    private readonly tokenRepository: Repository<TokenNotificacion>,
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: typeof admin,
  ) { }



  async registrarToken(
    token: string,
    userId: string,
    rol: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!token || token.trim() === '') {
        return {
          success: false,
          message: 'Token inválido',
        };
      }

      if (!userId || !rol) {
        return {
          success: false,
          message: 'Información de usuario incompleta',
        };
      }

      // Buscar si ya existe este token para este usuario
      let tokenExistente = await this.tokenRepository.findOne({
        where: { userId, token },
      });


      if (tokenExistente) {
        // Si existe, actualizar y marcar como activo
        tokenExistente.activo = true;
        tokenExistente.rol = rol;
        await this.tokenRepository.save(tokenExistente);
        this.logger.log(
          `Token actualizado para usuario ${userId} con rol ${rol}`,
        );
      } else {
        // Si no existe, crear nuevo
        const nuevoToken = this.tokenRepository.create({
          userId,
          token,
          rol,
          activo: true,
        });
        await this.tokenRepository.save(nuevoToken);
        this.logger.log(
          `Token registrado para usuario ${userId} con rol ${rol}`,
        );
      }


      // Obtener cantidad total de tokens activos
      const cantidadTokens = await this.tokenRepository.count({
        where: { activo: true },
      });
      this.logger.log(`Total de tokens activos: ${cantidadTokens}`);

      return {
        success: true,
        message: 'Token registrado correctamente',
      };
    } catch (error) {
      this.logger.error('Error al registrar token:', error);
      return {
        success: false,
        message: 'Error al registrar el token',
      };
    }
  }

  async obtenerTokensAdmin(): Promise<string[]> {
    try {
      const tokensAdmin = await this.tokenRepository.find({
        where: {
          rol: 'ADMINISTRADOR',
          activo: true,
        },
      });

      return tokensAdmin.map((t) => t.token);
    } catch (error) {
      this.logger.error('Error al obtener tokens admin:', error);
      return [];
    }
  }

  async obtenerTodosLosTokens(): Promise<UsuarioToken[]> {
    try {
      const tokens = await this.tokenRepository.find({
        where: { activo: true },
      });

      return tokens.map((t) => ({
        userId: t.userId,
        token: t.token,
        rol: t.rol,
      }));
    } catch (error) {
      this.logger.error('Error al obtener todos los tokens:', error);
      return [];
    }
  }


  // funcion para eliminar un token
  async eliminarToken(userId: string): Promise<boolean> {
    try {
      // Soft delete: marcar como inactivo en lugar de eliminar
      const result = await this.tokenRepository.update(
        { userId },
        { activo: false },
      );

      return (result.affected ?? 0) > 0;
    } catch (error) {
      this.logger.error('Error al eliminar token:', error);
      return false;
    }
  }


  // funcion para obtener la cantidad de tokens activos
  async obtenerCantidadTokens(): Promise<number> {
    try {
      return await this.tokenRepository.count({
        where: { activo: true },
      });
    } catch (error) {
      this.logger.error('Error al obtener cantidad de tokens:', error);
      return 0;
    }
  }


  // funcion para enviar notificaciones a los administradores
  async enviarNotificacionAdmin(
    titulo: string,
    mensaje: string,
    datos?: any,
    imagen?: string,
    mensajePush?: string,
  ): Promise<{ success: boolean; message: string; errores?: any[] }> {
    try {
      // 1. Guardar en Base de Datos (Historial)
      const nuevaNotificacion = this.notificacionRepository.create({
        titulo,
        mensaje,
        datos: datos || {},
        leida: false,
      });
      await this.notificacionRepository.save(nuevaNotificacion);

      // 2. Obtener tokens para enviar push
      const tokensAdmin = await this.obtenerTokensAdmin();

      if (tokensAdmin.length === 0) {
        return {
          success: true,
          message: 'Notificación guardada, pero no hay dispositivos registrados para push',
        };
      }

      this.logger.log(
        `Enviando notificación a ${tokensAdmin.length} administradores`,
      );

      // FCM requiere que todos los valores en 'data' sean strings
      const dataComoStrings: { [key: string]: string } = {};
      if (datos) {
        Object.keys(datos).forEach((key) => {
          dataComoStrings[key] = String(datos[key]);
        });
      }

      const mensaje_fcm: admin.messaging.MulticastMessage = {
        notification: {
          title: titulo,
          body: mensajePush || mensaje,
          imageUrl: imagen,
        },
        data: dataComoStrings,
        tokens: tokensAdmin,
      };

      const response =
        await this.firebaseAdmin.messaging().sendEachForMulticast(mensaje_fcm);

      this.logger.log(
        `Notificaciones enviadas: ${response.successCount} exitosas, ${response.failureCount} fallidas`,
      );

      // Registrar errores específicos y limpiar tokens inválidos
      if (response.failureCount > 0) {
        const tokensAEliminar: string[] = [];

        response.responses.forEach((resp, index) => {
          if (!resp.success) {
            this.logger.error(
              `Error en token ${index}: ${resp.error?.code} - ${resp.error?.message}`,
            );

            // Si el token no está registrado o es inválido, marcarlo para eliminación
            const errorCode = resp.error?.code;
            if (
              errorCode === 'messaging/registration-token-not-registered' ||
              errorCode === 'messaging/invalid-registration-token'
            ) {
              tokensAEliminar.push(tokensAdmin[index]);
            }
          }
        });

        // Limpiar tokens inválidos de la base de datos
        if (tokensAEliminar.length > 0) {
          for (const tokenInvalido of tokensAEliminar) {
            await this.tokenRepository.update(
              { token: tokenInvalido },
              { activo: false },
            );
          }
          this.logger.log(` Tokens inválidos limpiados: ${tokensAEliminar.length}`);
        }
      }

      return {
        success: true,
        message: `Notificación enviada a ${response.successCount} administradores`,
        errores:
          response.failureCount > 0
            ? response.responses
              .filter((r) => !r.success)
              .map((r) => r.error)
            : undefined,
      };
    } catch (error) {
      this.logger.error('Error al enviar notificación:', error);
      return {
        success: false,
        message: 'Error al enviar la notificación',
      };
    }
  }

  // Obtener historial de notificaciones
  async obtenerHistorial(limite: number = 50): Promise<Notificacion[]> {
    try {
      return await this.notificacionRepository.find({
        order: {
          fechaCreacion: 'DESC',
        },
        take: limite,
      });
    } catch (error) {
      this.logger.error('Error al obtener historial:', error);
      return [];
    }
  }

  // Marcar notificación como leida
  async marcarComoLeida(id: string): Promise<boolean> {
    try {
      const result = await this.notificacionRepository.update(id, {
        leida: true,
      });
      return (result.affected ?? 0) > 0;
    } catch (error) {
      this.logger.error('Error al marcar notificación como leída:', error);
      return false;
    }
  }
}