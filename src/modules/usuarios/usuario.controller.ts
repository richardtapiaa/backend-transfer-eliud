import { Controller, Post, Get, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { LoginDto } from '../auth/dto/login.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}



  // Registrar un nuevo usuario
  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  async registrarUsuario(@Body() loginDto: LoginDto) {
    return await this.usuarioService.registrarUsuario(loginDto);
  }



  // Obtener todos los usuarios
  @Get()
  @HttpCode(HttpStatus.OK)
  async obtenerTodos() {
    return await this.usuarioService.obtenerTodos();
  }


  // Obtener usuario por ID
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async obtenerPorId(@Param('id') id: string) {
    return await this.usuarioService.obtenerPorId(id);
  }


  // Eliminar usuario
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async eliminarUsuario(@Param('id') id: string) {
    return await this.usuarioService.eliminarUsuario(id);
  }
}
