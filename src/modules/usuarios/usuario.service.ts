import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './entities/usuario.entidad';
import { LoginDto } from '../auth/dto/login.dto';
import { UsuarioRol } from './enum/usuario.rol';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  // Registrar un nuevo usuario
  async registrarUsuario(loginDto: LoginDto) {
    const { correoElectronico, contrasena } = loginDto;

    // Verificar si el usuario ya existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { correoElectronico },
    });

    if (usuarioExistente) {
      throw new ConflictException('El correo ya está registrado');
    }

    // Hashear contraseña
    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

    // Crear usuario con rol ADMIN por defecto
    const nuevoUsuario = this.usuarioRepository.create({
      correoElectronico,
      contrasena: contrasenaHasheada,
      rol: UsuarioRol.ADMIN,
    });

    await this.usuarioRepository.save(nuevoUsuario);

    return {
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario.id,
        correoElectronico: nuevoUsuario.correoElectronico,
        rol: nuevoUsuario.rol,
      },
    };
  }



  // Obtener todos los usuarios
  async obtenerTodos() {
    return await this.usuarioRepository.find({
      select: ['id', 'correoElectronico', 'rol'],
    });
  }

  // Obtener usuario por ID
  async obtenerPorId(id: string) {
    return await this.usuarioRepository.findOne({
      where: { id },
      select: ['id', 'correoElectronico', 'rol'],
    });
  }

  
  // Eliminar usuario
  async eliminarUsuario(id: string) {
    const resultado = await this.usuarioRepository.delete(id);
    
    if (resultado.affected === 0) {
      throw new ConflictException('Usuario no encontrado');
    }

    return {
      mensaje: 'Usuario eliminado exitosamente',
    };
  }
}
