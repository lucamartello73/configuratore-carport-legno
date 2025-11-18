import { createGmailTransport } from "./gmail-transport"

/**
 * Helper per invio email tramite Gmail
 * @param to - Email destinatario
 * @param subject - Oggetto email
 * @param html - Contenuto HTML email
 * @param from - (Opzionale) Mittente personalizzato
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  from?: string
) {
  const transporter = createGmailTransport()
  
  const defaultFrom = `"Martello1930 Configuratore" <${process.env.GMAIL_USER}>`
  
  return await transporter.sendMail({
    from: from || defaultFrom,
    to,
    subject,
    html,
  })
}

/**
 * Invia email con configurazione carport
 */
export async function sendConfigurationEmail(
  configuration: any,
  customerName: string,
  customerEmail: string,
  customerPhone?: string,
  configuratorType?: string
) {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.GMAIL_USER
  
  // Email al cliente
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9fafb; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Grazie ${customerName}!</h1>
        </div>
        <div class="content">
          <p>Abbiamo ricevuto la tua richiesta di preventivo per il configuratore ${configuratorType || 'carport'}.</p>
          <p>Ti contatteremo al più presto per fornirti un preventivo dettagliato.</p>
          <p><strong>I tuoi dati:</strong></p>
          <ul>
            <li>Nome: ${customerName}</li>
            <li>Email: ${customerEmail}</li>
            ${customerPhone ? `<li>Telefono: ${customerPhone}</li>` : ''}
          </ul>
        </div>
        <div class="footer">
          <p>Martello1930 - Soluzioni per Coperture</p>
          <p>preventivi@martello1930.net | +39 0185 167 656</p>
        </div>
      </div>
    </body>
    </html>
  `
  
  // Email all'admin
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; }
        .content { padding: 20px; background: #fff; border: 1px solid #ddd; }
        .config-details { background: #f3f4f6; padding: 15px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Nuova Richiesta Preventivo - ${configuratorType || 'Carport'}</h2>
        </div>
        <div class="content">
          <h3>Dati Cliente:</h3>
          <ul>
            <li><strong>Nome:</strong> ${customerName}</li>
            <li><strong>Email:</strong> ${customerEmail}</li>
            ${customerPhone ? `<li><strong>Telefono:</strong> ${customerPhone}</li>` : ''}
          </ul>
          
          <h3>Configurazione:</h3>
          <div class="config-details">
            <pre>${JSON.stringify(configuration, null, 2)}</pre>
          </div>
        </div>
      </div>
    </body>
    </html>
  `
  
  // Invia entrambe le email
  await sendEmail(customerEmail, 'Conferma Ricezione Richiesta', customerHtml)
  await sendEmail(adminEmail!, `Nuova Richiesta - ${customerName}`, adminHtml)
}
