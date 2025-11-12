import { createGmailTransport } from './gmail-transport'
import type { ConfigurationData } from '@/types/configuration'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

/**
 * Invia una email usando Gmail SMTP
 */
export async function sendEmail({ to, subject, html, from }: SendEmailOptions) {
  const transport = createGmailTransport()
  
  const mailOptions = {
    from: from || process.env.GMAIL_USER,
    to,
    subject,
    html,
  }

  try {
    const info = await transport.sendMail(mailOptions)
    console.log('✅ Email inviata:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Errore invio email:', error)
    throw error
  }
}

/**
 * Genera HTML email per configurazione carport/pergola
 */
export function generateConfigurationEmail(
  configuration: Partial<ConfigurationData>,
  customerName: string,
  customerEmail: string,
  customerPhone?: string,
  configuratorType: 'acciaio' | 'legno' = 'acciaio'
): string {
  const isWood = configuratorType === 'legno'
  const productType = isWood ? 'Copertura in Legno' : 'Carport in Acciaio/Alluminio'
  const color = isWood ? '#008f4c' : '#2563eb'

  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Configurazione ${productType}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <!-- Container principale -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                🏠 Martello1930
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">
                Configurazione ${productType}
              </p>
            </td>
          </tr>

          <!-- Contenuto -->
          <tr>
            <td style="padding: 30px 20px;">
              <h2 style="margin: 0 0 20px 0; color: #333333; font-size: 22px;">
                Grazie per la tua richiesta!
              </h2>
              <p style="margin: 0 0 15px 0; color: #666666; font-size: 16px; line-height: 1.6;">
                Ciao <strong>${customerName}</strong>,<br><br>
                Abbiamo ricevuto la tua configurazione per un <strong>${productType}</strong>.
                Il nostro team ti contatterà presto per finalizzare il preventivo.
              </p>

              <!-- Dati Cliente -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border: 1px solid #e5e5e5; border-radius: 6px;">
                <tr>
                  <td style="background-color: #f9f9f9; padding: 12px 15px; border-bottom: 1px solid #e5e5e5;">
                    <strong style="color: #333333;">📋 Dati Cliente</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px;">
                    <p style="margin: 0 0 8px 0; color: #666666;"><strong>Nome:</strong> ${customerName}</p>
                    <p style="margin: 0 0 8px 0; color: #666666;"><strong>Email:</strong> ${customerEmail}</p>
                    ${customerPhone ? `<p style="margin: 0; color: #666666;"><strong>Telefono:</strong> ${customerPhone}</p>` : ''}
                  </td>
                </tr>
              </table>

              <!-- Dettagli Configurazione -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0; border: 1px solid #e5e5e5; border-radius: 6px;">
                <tr>
                  <td style="background-color: #f9f9f9; padding: 12px 15px; border-bottom: 1px solid #e5e5e5;">
                    <strong style="color: #333333;">🔧 Dettagli Configurazione</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 15px;">
                    ${configuration.width && configuration.depth ? `
                      <p style="margin: 0 0 8px 0; color: #666666;">
                        <strong>Dimensioni:</strong> ${configuration.width}m x ${configuration.depth}m
                      </p>
                    ` : ''}
                    ${configuration.coverageTypeName ? `
                      <p style="margin: 0 0 8px 0; color: #666666;">
                        <strong>Copertura:</strong> ${configuration.coverageTypeName}
                      </p>
                    ` : ''}
                    ${configuration.colorName ? `
                      <p style="margin: 0 0 8px 0; color: #666666;">
                        <strong>Colore:</strong> ${configuration.colorName}
                      </p>
                    ` : ''}
                    ${configuration.accessories && configuration.accessories.length > 0 ? `
                      <p style="margin: 0 0 8px 0; color: #666666;">
                        <strong>Accessori:</strong> ${configuration.accessories.join(', ')}
                      </p>
                    ` : ''}
                    ${configuration.packageName ? `
                      <p style="margin: 0 0 8px 0; color: #666666;">
                        <strong>Pacchetto:</strong> ${configuration.packageName}
                      </p>
                    ` : ''}
                    ${configuration.surfaceName ? `
                      <p style="margin: 0 0 8px 0; color: #666666;">
                        <strong>Superficie:</strong> ${configuration.surfaceName}
                      </p>
                    ` : ''}
                    ${configuration.totalPrice ? `
                      <p style="margin: 15px 0 0 0; color: #333333; font-size: 18px;">
                        <strong>Prezzo Totale:</strong> <span style="color: ${color}; font-size: 22px; font-weight: bold;">€${configuration.totalPrice.toFixed(2)}</span>
                      </p>
                    ` : ''}
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                <strong>Prossimi passi:</strong><br>
                1. Riceverai un preventivo dettagliato entro 24-48 ore<br>
                2. Un nostro esperto ti contatterà per eventuali chiarimenti<br>
                3. Potremo fissare un sopralluogo gratuito se necessario
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                <strong>Martello1930</strong> - Artigianato del Legno dal 1930
              </p>
              <p style="margin: 0 0 5px 0; color: #888888; font-size: 13px;">
                📧 info@martello1930.net | 📞 +39 XXX XXX XXXX
              </p>
              <p style="margin: 0; color: #888888; font-size: 13px;">
                www.martello1930.net
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

/**
 * Invia email di conferma configurazione
 */
export async function sendConfigurationEmail(
  configuration: Partial<ConfigurationData>,
  customerName: string,
  customerEmail: string,
  customerPhone?: string,
  configuratorType: 'acciaio' | 'legno' = 'acciaio'
) {
  const productType = configuratorType === 'legno' ? 'Copertura in Legno' : 'Carport in Acciaio/Alluminio'
  const html = generateConfigurationEmail(configuration, customerName, customerEmail, customerPhone, configuratorType)

  // Invia email al cliente
  await sendEmail({
    to: customerEmail,
    subject: `Configurazione ${productType} - Martello1930`,
    html,
  })

  // Invia copia all'azienda
  const adminEmail = process.env.GMAIL_USER || 'info@martello1930.net'
  await sendEmail({
    to: adminEmail,
    subject: `[NUOVA CONFIGURAZIONE] ${productType} - ${customerName}`,
    html,
  })

  return { success: true }
}
