import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ReviewsService {
  private cache: Record<string, any[]> = {};
  private lastFetch: Record<string, number> = {};
  private TTL = 1000 * 60 * 60;

  async getReviews(lang: string = 'es') {
    const now = Date.now();

    // Verificar si tenemos caché válido para este idioma específico
    if (this.cache[lang] && this.lastFetch[lang] && now - this.lastFetch[lang] < this.TTL) {
      console.log(`Devolviendo comentarios del caché para idioma: ${lang}`);
      return this.cache[lang];
    }

    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: 'ChIJjQK99phzoY8RzJG2XaVnvI0',
          fields: 'reviews',
          language: lang,
          key: process.env.GOOGLE_API_KEY,
        },
      }
    );

    const reviews = response.data.result.reviews.map(r => ({
      author: r.author_name,
      rating: r.rating,
      text: r.text,
      photo: r.profile_photo_url || null,
      language: r.language || 'unknown',
    }));


  
    this.cache[lang] = reviews;
    this.lastFetch[lang] = now;

    return reviews;
  }
}