import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('notificaciones')
export class Notificacion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    titulo: string;

    @Column({ type: 'text' })
    mensaje: string;

    @Column({ type: 'jsonb', nullable: true })
    datos: any; // Para guardar reservaId, etc.

    @Column({ type: 'boolean', default: false })
    leida: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    fechaCreacion: Date;
}
