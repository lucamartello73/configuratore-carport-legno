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
