/**
 * Script test invio email Gmail standalone
 * Esecuzione: node test-email.js
 */

require('dotenv').config({ path: '.env.local' })
const nodemailer = require('nodemailer')

// Verifica variabili ambiente
console.log('🔍 Verifica Variabili Ambiente:')
console.log('GMAIL_USER:', process.env.GMAIL_USER ? '✅ Configurato' : '❌ Mancante')
console.log('GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '✅ Configurato' : '❌ Mancante')

if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
  console.error('\n❌ Variabili ambiente mancanti!')
  console.error('Crea file .env.local con:')
  console.error('GMAIL_USER=tua-email@gmail.com')
  console.error('GMAIL_APP_PASSWORD=password-app-senza-spazi')
  process.exit(1)
}

// Crea transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

async function test() {
  console.log('\n📧 Tentativo invio email di test...')
  
  try {
    const info = await transporter.sendMail({
      from: `"Martello1930 Test" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Invia a te stesso
      subject: '✅ Test Sistema Email - Configuratore Legno',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .box { background: #f0f9ff; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>✅ Sistema Email Funzionante!</h1>
            <p>Questo è un test del sistema email del configuratore Martello1930.</p>
            <p><strong>Configurazione SMTP:</strong></p>
            <ul>
              <li>Host: smtp.gmail.com</li>
              <li>Port: 587 (TLS)</li>
              <li>User: ${process.env.GMAIL_USER}</li>
            </ul>
            <p>Se ricevi questa email, il sistema è configurato correttamente! 🎉</p>
            <hr>
            <p style="font-size: 12px; color: #666;">
              Timestamp: ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}
            </p>
          </div>
        </body>
        </html>
      `,
    })
    
    console.log('✅ Email inviata con successo!')
    console.log('📬 Message ID:', info.messageId)
    console.log('📧 Destinatario:', process.env.GMAIL_USER)
    console.log('\n🎉 Test completato! Controlla la tua inbox.')
    
  } catch (error) {
    console.error('\n❌ Errore invio email:', error.message)
    
    if (error.code === 'EAUTH') {
      console.error('\n🔐 Errore Autenticazione Gmail')
      console.error('Soluzioni:')
      console.error('1. Verifica che la verifica 2 passaggi sia attiva')
      console.error('2. Rigenera password app su https://myaccount.google.com/apppasswords')
      console.error('3. Controlla che la password sia senza spazi')
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🌐 Errore Connessione SMTP')
      console.error('Verifica la connessione internet e firewall')
    }
    
    process.exit(1)
  }
}

test()
