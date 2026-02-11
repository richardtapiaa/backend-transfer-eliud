export function contactEmailTemplate(payload: {
  nombre: string
  apellido?: string
  email: string
  telefono?: string
  pais?: string
  message: string
}) {
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:40px 20px;">
      <tr>
        <td align="center">
          
          <!-- Container principal -->
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            
            <!-- Header con gradiente -->
            <tr>
              <td style="background:linear-gradient(135deg, #8BC34A 0%, #689F38 100%);padding:50px 40px;text-align:center;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <img 
                        src="https://drive.google.com/uc?export=view&id=1rds2mbnjmD_wBMiVd94lBLRBKpHqXN2T"
                        alt="Logo"
                        style="height:70px;display:block;margin:0 auto 20px;"
                      />
                      <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:600;letter-spacing:-0.5px;line-height:1.2;">
                        Nueva Solicitud de Contacto
                      </h1>
                      <p style="color:rgba(255,255,255,0.9);margin:8px 0 0 0;font-size:14px;">
                        Recibido desde tu sitio web
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Barra decorativa -->
            <tr>
              <td style="background:#8BC34A;height:3px;"></td>
            </tr>

            <!-- Introducción -->
            <tr>
              <td style="padding:32px 40px 24px 40px;">
                <p style="color:#37474F;font-size:15px;line-height:1.6;margin:0;">
                  Has recibido una nueva solicitud de contacto. A continuación los detalles del cliente:
                </p>
              </td>
            </tr>

            <!-- Separador -->
            <tr>
              <td style="padding:0 40px;">
                <div style="border-top:1px solid #E5E7EB;"></div>
              </td>
            </tr>

            <!-- Información del contacto -->
            <tr>
              <td style="padding:0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FBF6;">
                  <tr>
                    <td style="padding:28px 40px;">
                      
                      <!-- Nombre -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                        <tr>
                          <td width="160" style="vertical-align:top;padding:6px 0;">
                            <span style="color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                              Nombre completo
                            </span>
                          </td>
                          <td style="vertical-align:top;padding:6px 0;">
                            <span style="color:#1E293B;font-size:15px;font-weight:500;">
                              ${payload.nombre} ${payload.apellido ?? ''}
                            </span>
                          </td>
                        </tr>
                      </table>

                      <!-- Email -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                        <tr>
                          <td width="160" style="vertical-align:top;padding:6px 0;">
                            <span style="color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                              Correo electrónico
                            </span>
                          </td>
                          <td style="vertical-align:top;padding:6px 0;">
                            <a href="mailto:${payload.email}" style="color:#8BC34A;font-size:15px;text-decoration:none;font-weight:500;">
                              ${payload.email}
                            </a>
                          </td>
                        </tr>
                      </table>

                      ${payload.telefono ? `
                      <!-- Teléfono -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                        <tr>
                          <td width="160" style="vertical-align:top;padding:6px 0;">
                            <span style="color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                              Teléfono
                            </span>
                          </td>
                          <td style="vertical-align:top;padding:6px 0;">
                            <span style="color:#1E293B;font-size:15px;font-weight:500;">
                              ${payload.telefono}
                            </span>
                          </td>
                        </tr>
                      </table>
                      ` : ''}

                      <!-- País -->
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="160" style="vertical-align:top;padding:6px 0;">
                            <span style="color:#64748B;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                              País
                            </span>
                          </td>
                          <td style="vertical-align:top;padding:6px 0;">
                            <span style="color:#1E293B;font-size:15px;font-weight:500;">
                              ${payload.pais ?? 'No especificado'}
                            </span>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Separador -->
            <tr>
              <td style="padding:0 40px;">
                <div style="border-top:1px solid #E5E7EB;"></div>
              </td>
            </tr>

            <!-- Mensaje -->
            <tr>
              <td style="padding:32px 40px;">
                <p style="color:#64748B;font-size:13px;font-weight:600;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.5px;">
                  Mensaje del cliente
                </p>
                <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:20px;">
                  <p style="color:#334155;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${payload.message}</p>
                </div>
              </td>
            </tr>

            <!-- Separador -->
            <tr>
              <td style="padding:0 40px;">
                <div style="border-top:1px solid #E5E7EB;"></div>
              </td>
            </tr>

            <!-- Call to action -->
            <tr>
              <td style="padding:32px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center">
                      <a href="mailto:${payload.email}" style="display:inline-block;background:#8BC34A;color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-weight:600;font-size:14px;box-shadow:0 2px 8px rgba(139,195,74,0.25);transition:all 0.3s ease;">
                        Responder al cliente
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Separador -->
            <tr>
              <td style="padding:0 40px;">
                <div style="border-top:1px solid #E5E7EB;"></div>
              </td>
            </tr>

            <!-- Información adicional -->
            <tr>
              <td style="padding:0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;">
                  <tr>
                    <td style="padding:24px 40px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="50%" style="padding-right:10px;">
                            <p style="color:#64748B;font-size:12px;font-weight:600;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.5px;">
                              Fecha de solicitud
                            </p>
                            <p style="color:#94A3B8;font-size:13px;margin:0;">
                              ${currentDate}
                            </p>
                          </td>
                          <td width="50%" style="padding-left:10px;">
                            <p style="color:#64748B;font-size:12px;font-weight:600;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:0.5px;">
                              Origen del mensaje
                            </p>
                            <p style="color:#94A3B8;font-size:13px;margin:0;">
                              Formulario de contacto
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Separador -->
            <tr>
              <td style="padding:0;">
                <div style="border-top:1px solid #E5E7EB;"></div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#F9FAFB;padding:24px 40px;text-align:center;">
                <p style="color:#64748B;font-size:13px;margin:0 0 6px 0;line-height:1.5;">
                  Este correo fue generado automáticamente desde el sitio web "Transfer Eliud".
                </p>
                <p style="color:#94A3B8;font-size:12px;margin:0;line-height:1.4;">
                  Por favor, usa el botón "Responder al cliente" para contactar directamente
                </p>
              </td>
            </tr>

          </table>

          <!-- Copyright -->
          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;margin-top:20px;">
            <tr>
              <td align="center">
                <p style="color:#94A3B8;font-size:12px;margin:0;">
                  © ${new Date().getFullYear()} Todos los derechos reservados
                </p>
              </td>
            </tr>
          </table>
          
        </td>
      </tr>
    </table>

  </body>
  </html>
  `
}