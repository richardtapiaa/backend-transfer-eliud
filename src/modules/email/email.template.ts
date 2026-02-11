import { EnviarEmailDto } from './dto/enviar-email.dto'

export function generateEmailTemplate(payload: EnviarEmailDto) {
  const subject = `Contacto desde web — ${payload.nombre}${payload.apellido ? ' ' + payload.apellido : ''}`

  const html = `
    <h3>Nuevo mensaje de solicitud de reserva</h3>
    <p><strong>Nombre:</strong> ${payload.nombre} ${payload.apellido ?? ''}</p>
    <p><strong>Email:</strong> <a href="mailto:${payload.email}">${payload.email}</a></p>
    <p><strong>Teléfono:</strong> ${payload.telefono ?? 'N/A'}</p>
    <p><strong>País:</strong> ${payload.pais ?? 'N/A'}</p>
    <hr/>
    <p>${payload.message.replace(/\n/g, '<br/>')}</p>
  `

  const text = `Nombre: ${payload.nombre} ${payload.apellido ?? ''}\nEmail: ${payload.email}\nTeléfono: ${payload.telefono ?? 'N/A'}\nPaís: ${payload.pais ?? 'N/A'}\n\n${payload.message}`

  return { subject, html, text }
}

export default generateEmailTemplate
