import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Usuario } from '../usuarios/entities/usuario.entidad';
import { LoginDto } from './dto/login.dto';
import { UsuarioRol } from '../usuarios/enum/usuario.rol';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) { }

  // Función de iniciar sesión (autenticación)
  async login(loginDto: LoginDto) {
    const { correoElectronico, contrasena } = loginDto;

    // Buscar usuario por correo
    const usuario = await this.usuarioRepository.findOne({
      where: { correoElectronico },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Verificar contraseña
    const esContrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!esContrasenaValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Verificar que el usuario tenga rol de ADMINISTRADOR
    if (usuario.rol !== UsuarioRol.ADMIN) {
      throw new UnauthorizedException('Acceso denegado. Solo administradores pueden autenticarse');
    }

    // Generar payload para el token JWT
    const payload = {
      sub: usuario.id, // "sub" es el estándar para el ID del usuario
      email: usuario.correoElectronico,
      rol: usuario.rol,
    };

    // Generar token JWT firmado
    const token = this.jwtService.sign(payload);

    return {
      mensaje: 'Login exitoso',
      token, // ⬅️ Token JWT que el frontend guardará
      usuario: {
        id: usuario.id,
        correoElectronico: usuario.correoElectronico,
        rol: usuario.rol,
      },
    };
  }
}
