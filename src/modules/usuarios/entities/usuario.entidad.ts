import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UsuarioRol } from '../enum/usuario.rol';

@Entity('usuarios')
export class Usuario {
    
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  correoElectronico: string;

  @Column({ type: 'varchar', length: 255 })
  contrasena: string;

  @Column({
    type: 'enum',
    enum: UsuarioRol,
    default: UsuarioRol.ADMIN,
  })
  rol: UsuarioRol;

}
