import { IsString, IsNotEmpty } from 'class-validator';

export class RegistrarTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  rol: string;
}
