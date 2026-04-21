import { Controller, Get, Query } from '@nestjs/common';
import { ReviewsService } from './comentarios.service';


@Controller('comentarios')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async getReviews(@Query('lang') lang?: string) {
    return this.reviewsService.getReviews(lang || 'es');
  }
}
