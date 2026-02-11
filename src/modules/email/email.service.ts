import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'
import { EnviarEmailDto } from './dto/enviar-email.dto'
import { generateEmailTemplate } from './email.template'
import { contactEmailTemplate } from './templates/email.template'






@Injectable()

export class EmailService {
  private readonly logger = new Logger(EmailService.name)
  private client: Resend | null = null

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('RESEND_API_KEY') || this.config.get<string>('MAIL_API_KEY')
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY not configured — email sending disabled')
      this.client = null
    } else {
      this.client = new Resend(apiKey)
      this.logger.log('Resend client initialized')
    }
  }

  async sendEmail(payload: EnviarEmailDto) {
    if (!this.client) {
      this.logger.error('Resend client not configured. Aborting sendEmail.')
      throw new InternalServerErrorException('Email client is not configured')
    }

    const to = this.config.get<string>('EMAIL_TO') || this.config.get<string>('MAIL_TO')
    if (!to) {
      this.logger.error('No recipient configured in EMAIL_TO / MAIL_TO env var')
      throw new InternalServerErrorException('No recipient configured')
    }

    const from = this.config.get<string>('MAIL_FROM') || this.config.get<string>('RESEND_FROM') || this.config.get<string>('FROM_EMAIL')

  
    const subject = `Contacto desde web — ${payload.nombre}${payload.apellido ? ' ' + payload.apellido : ''}`
    
    let html = contactEmailTemplate ? contactEmailTemplate(payload as any) : undefined
    
    const { text: fallbackText, html: fallbackHtml } = generateEmailTemplate(payload)
    if (!html) html = fallbackHtml
    const text = fallbackText

    try {
      const res = await this.client.emails.send({
        from: from || 'no-reply@localhost',
        to,
        subject,
        html,
        text,
     
        headers: {
          'Reply-To': payload.email,
        },
      } as any)

      const isDev = (this.config.get<string>('NODE_ENV') || process.env.NODE_ENV) === 'development'
      if (isDev) {
        try {
          this.logger.debug(`Resend response: ${JSON.stringify(res, null, 2)}`)
        } catch (e) {
          this.logger.debug('Resend response (stringify failed): ' + String(res))
        }
      }

    
      const sendId = (res as any)?.data?.id ?? (res as any)?.id ?? 'unknown'
      this.logger.log(`Email enviado via Resend to=${to} id=${sendId}`)
   
      return { id: sendId }
    } catch (err) {
      this.logger.error('Error sending email with Resend: ' + (err?.message ?? err))
      throw new InternalServerErrorException('Error sending email')
    }
  }
}



