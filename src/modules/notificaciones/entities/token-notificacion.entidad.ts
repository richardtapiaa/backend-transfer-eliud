import {Entity,Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index,} from 'typeorm';

@Entity('tokens_notificaciones')
@Index(['userId', 'token'], { unique: true }) // Evita duplicados del mismo token para el mismo usuario
export class TokenNotificacion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    userId: string;

    @Column({ type: 'text' })
    token: string;

    @Column({ type: 'varchar', length: 50 })
    rol: string;

    @Column({ type: 'boolean', default: true })
    activo: boolean;

    @CreateDateColumn()
    fechaRegistro: Date;

    @UpdateDateColumn()
    fechaActualizacion: Date;
}
