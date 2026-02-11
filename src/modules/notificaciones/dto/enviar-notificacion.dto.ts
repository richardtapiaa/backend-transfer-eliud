import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class EnviarNotificacionDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  mensaje: string;

  @IsOptional()
  @IsObject()
  datos?: any;
}
