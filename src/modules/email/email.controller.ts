import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { Throttle, ThrottlerGuard } from '@nestjs/throttler'
import { EmailService } from './email.service'
import { EnviarEmailDto } from './dto/enviar-email.dto'

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) { }


  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 1, ttl: 7200000 } })
  @Post()
  @HttpCode(HttpStatus.OK)
  async send(@Body() enviarEmailDto: EnviarEmailDto) {

    const res = await this.emailService.sendEmail(enviarEmailDto)
    const id = (res as any)?.id ?? null
    return { ok: true, id }
  }
}

export default EmailController
