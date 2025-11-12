import nodemailer from 'nodemailer'

/**
 * Crea un transport Nodemailer configurato per Gmail SMTP
 * 
 * Requisiti:
 * - GMAIL_USER: indirizzo email Gmail (es: info@martello1930.net)
 * - GMAIL_APP_PASSWORD: App Password generata da Google Account
 * 
 * NOTA: NON usare la password normale dell'account Gmail!
 * Genera una App Password da: https://myaccount.google.com/security
 */
export function createGmailTransport() {
  const gmailUser = process.env.GMAIL_USER
  const gmailPassword = process.env.GMAIL_APP_PASSWORD

  if (!gmailUser || !gmailPassword) {
    console.error('❌ Configurazione email mancante!')
    console.error('Variabili ambiente richieste:')
    console.error('- GMAIL_USER:', gmailUser ? '✅' : '❌ MANCANTE')
    console.error('- GMAIL_APP_PASSWORD:', gmailPassword ? '✅' : '❌ MANCANTE')
    throw new Error('Gmail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD environment variables.')
  }

  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true per porta 465, false per altre porte
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
    tls: {
      rejectUnauthorized: true
    }
  })

  return transport
}

/**
 * Verifica la connessione Gmail SMTP
 * Utile per testare la configurazione
 */
export async function verifyGmailConnection(): Promise<boolean> {
  try {
    const transport = createGmailTransport()
    await transport.verify()
    console.log('✅ Gmail SMTP connection verified')
    return true
  } catch (error) {
    console.error('❌ Gmail SMTP connection failed:', error)
    return false
  }
}
