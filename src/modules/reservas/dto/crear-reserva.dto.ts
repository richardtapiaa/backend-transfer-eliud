import { IsString, IsEmail, IsDateString, IsInt, IsNotEmpty, Min, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class CrearReservaDto {

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;


  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString({ message: 'El teléfono debe ser un texto' })
  @MaxLength(20, { message: 'El teléfono no puede exceder 20 caracteres' })
  telefono: string;


  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @MaxLength(100, { message: 'El correo electrónico no puede exceder 100 caracteres' })
  correoElectronico: string;


  @IsNotEmpty({ message: 'La fecha y hora del servicio es requerida' })
  @IsDateString({}, { message: 'La fecha y hora del servicio debe ser válida' })
  fechaHoraServicio: string;


  @IsNotEmpty({ message: 'El lugar de recogida es requerido' })
  @IsString({ message: 'El lugar de recogida debe ser un texto' })
  @MaxLength(255, { message: 'El lugar de recogida no puede exceder 255 caracteres' })
  lugarRecogida: string;

  @IsNotEmpty({ message: 'El destino es requerido' })
  @IsString({ message: 'El destino debe ser un texto' })
  @MaxLength(255, { message: 'El destino no puede exceder 255 caracteres' })
  destino: string;

  @IsNotEmpty({ message: 'La cantidad de personas es requerida' })
  @IsInt({ message: 'La cantidad de personas debe ser un número entero' })
  @Min(1, { message: 'La cantidad de personas debe ser al menos 1' })
  cantidadPersonas: number;

  @IsOptional()
  @IsBoolean({ message: 'El campo desdeAdmin debe ser un booleano' })
  desdeAdmin?: boolean;



  @IsOptional()
  @IsInt({ message: 'El monto debe ser un número decimal' })
  monto?: number;

  @IsOptional()
  comision?: number;

  @IsOptional()
  @IsString({ message: 'El chofer debe ser un texto' })
  @MaxLength(100, { message: 'El chofer no puede exceder 100 caracteres' })
  chofer?: string;

  @IsOptional()
  @IsString({ message: 'El vuelo debe ser un texto' })
  @MaxLength(50, { message: 'El vuelo no puede exceder 50 caracteres' })
  vuelo?: string;


  
  @IsOptional()
  @IsString({ message: 'El mensaje debe ser un texto' })
  @MaxLength(1000, { message: 'El mensaje no puede exceder 1000 caracteres' })
  mensaje?: string;



}
