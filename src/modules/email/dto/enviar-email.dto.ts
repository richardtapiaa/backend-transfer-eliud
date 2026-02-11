import { IsEmail, IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';

export class EnviarEmailDto {


	@IsNotEmpty({ message: 'El nombre es requerido' })
	@IsString({ message: 'El nombre debe ser un texto' })
	@MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
	nombre: string;


	@IsOptional()
	@IsString({ message: 'El apellido debe ser un texto' })
	@MaxLength(100, { message: 'El apellido no puede exceder 100 caracteres' })
	apellido?: string;


	@IsNotEmpty({ message: 'El correo es requerido' })
	@IsEmail({}, { message: 'El correo debe ser válido' })
	@MaxLength(150, { message: 'El correo no puede exceder 150 caracteres' })
	email: string;


	@IsOptional()
	@IsString({ message: 'El teléfono debe ser un texto' })
	@MaxLength(30, { message: 'El teléfono no puede exceder 30 caracteres' })
	telefono?: string;


	@IsOptional()
	@IsString({ message: 'El país debe ser un texto' })
	@MaxLength(100, { message: 'El país no puede exceder 100 caracteres' })
	pais?: string;


	@IsNotEmpty({ message: 'El mensaje es requerido' })
	@IsString({ message: 'El mensaje debe ser un texto' })
	@MaxLength(2000, { message: 'El mensaje no puede exceder 2000 caracteres' })
	message: string;



}
