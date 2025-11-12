import * as nodemailer from "nodemailer"

/**
 * Crea transport Gmail configurato per SMTP
 * Usa variabili ambiente: GMAIL_USER e GMAIL_APP_PASSWORD
 */
export const createGmailTransport = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error(
      "Configurazione Gmail mancante. Verifica variabili ambiente GMAIL_USER e GMAIL_APP_PASSWORD"
    )
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // TLS su porta 587
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}
