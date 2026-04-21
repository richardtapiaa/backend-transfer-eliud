import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';



// modulo principal de la aplicacion
import { AppModule } from './app.module';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    
  // configuracion de CORS
  app.enableCors({
    origin: [
      'https://www.transfer-eliud.com',
      'https://transfereliud.vercel.app',
      'http://localhost:4321',  // Frontend en desarrollo
      'http://localhost:3000',  // Alternativo
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  
  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
