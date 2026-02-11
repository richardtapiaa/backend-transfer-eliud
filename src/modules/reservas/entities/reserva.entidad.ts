import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ReservaEstado } from '../enums/reseva-estado';

@Entity('reservas')

export class Reserva {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;


  @Column({ type: 'varchar', length: 20 })
  telefono: string;


  @Column({ type: 'varchar', length: 100 })
  correoElectronico: string;


  @Column({ type: 'timestamp' })
  fechaHoraServicio: Date;


  @Column({ type: 'varchar', length: 255 })
  lugarRecogida: string;


  @Column({ type: 'varchar', length: 255 })
  destino: string;


  @Column({ type: 'int' })
  cantidadPersonas: number;

  @Column({
    type: 'enum',
    enum: ReservaEstado,
    default: ReservaEstado.PENDIENTE,
  })
  estado: ReservaEstado;


  @CreateDateColumn()
  fechaCreacion: Date;


  @UpdateDateColumn()
  fechaActualizacion: Date;



  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monto: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  comision: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  chofer: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  vuelo: string;

  @Column({ type: 'text', nullable: true })
  mensaje: string;


}
