import { Module } from '@nestjs/common';
import { ReviewsService } from './comentarios.service';
import { ReviewsController } from './comentarios.controller';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ComentariosModule {}
