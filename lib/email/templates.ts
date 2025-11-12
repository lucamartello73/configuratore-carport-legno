/**
 * Template email per configuratore legno
 */

interface ConfigurationEmailData {
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  customerCity: string
  customerCap: string
  customerProvince: string
  contactPreference: string
  structureType: string
  modelName: string
  dimensions: {
    width: number
    depth: number
    height: number
  }
  coverageType: string
  colorName: string
  surfaceName: string
  packageType: string
  totalPrice: number
}

/**
 * Template email conferma cliente
 */
export function generateCustomerConfirmationEmail(data: ConfigurationEmailData): string {
  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      background: white;
      margin: 20px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #8b4513 0%, #654321 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 30px 20px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section h2 {
      color: #8b4513;
      font-size: 18px;
      margin-bottom: 10px;
      border-bottom: 2px solid #8b4513;
      padding-bottom: 5px;
    }
    .info-row {
      display: flex;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .info-label {
      font-weight: 600;
      min-width: 140px;
      color: #666;
    }
    .info-value {
      color: #333;
    }
    .price-box {
      background: #f8f9fa;
      border-left: 4px solid #8b4513;
      padding: 15px;
      margin: 20px 0;
      font-size: 20px;
      font-weight: 700;
      color: #8b4513;
      text-align: center;
    }
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      font-size: 14px;
      color: #666;
      border-top: 1px solid #eee;
    }
    .footer a {
      color: #8b4513;
      text-decoration: none;
    }
    .cta-button {
      display: inline-block;
      background: #8b4513;
      color: white;
      padding: 12px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Configurazione Ricevuta!</h1>
      <p style="margin: 10px 0 0 0; font-size: 16px;">Grazie per aver scelto Martello1930</p>
    </div>
    
    <div class="content">
      <p style="font-size: 16px;">Gentile <strong>${data.customerName}</strong>,</p>
      
      <p>Abbiamo ricevuto correttamente la tua richiesta di preventivo per una struttura in legno. Ti risponderemo entro <strong>24-48 ore lavorative</strong> all'indirizzo email <strong>${data.customerEmail}</strong>.</p>
      
      <div class="section">
        <h2>🏗️ Struttura Configurata</h2>
        <div class="info-row">
          <span class="info-label">Tipo Struttura:</span>
          <span class="info-value">${data.structureType}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Modello:</span>
          <span class="info-value">${data.modelName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Dimensioni:</span>
          <span class="info-value">${data.dimensions.width}cm × ${data.dimensions.depth}cm × ${data.dimensions.height}cm</span>
        </div>
        <div class="info-row">
          <span class="info-label">Copertura:</span>
          <span class="info-value">${data.coverageType}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Colore:</span>
          <span class="info-value">${data.colorName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Superficie:</span>
          <span class="info-value">${data.surfaceName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Pacchetto:</span>
          <span class="info-value">${data.packageType}</span>
        </div>
      </div>
      
      <div class="price-box">
        💰 Prezzo Indicativo: €${data.totalPrice.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      
      <div class="section">
        <h2>📋 I Tuoi Dati</h2>
        <div class="info-row">
          <span class="info-label">Nome:</span>
          <span class="info-value">${data.customerName}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value">${data.customerEmail}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Telefono:</span>
          <span class="info-value">${data.customerPhone}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Indirizzo:</span>
          <span class="info-value">${data.customerAddress}, ${data.customerCity} ${data.customerCap} (${data.customerProvince})</span>
        </div>
        <div class="info-row">
          <span class="info-label">Preferenza Contatto:</span>
          <span class="info-value">${data.contactPreference}</span>
        </div>
      </div>
      
      <p style="margin-top: 30px;">Il prezzo indicato è <strong>orientativo</strong> e potrebbe variare in base a:</p>
      <ul style="color: #666;">
        <li>Complessità dell'installazione</li>
        <li>Condizioni del terreno</li>
        <li>Accessibilità del sito</li>
        <li>Eventuali personalizzazioni richieste</li>
      </ul>
      
      <p style="margin-top: 20px;">Se hai domande o necessiti di chiarimenti, non esitare a contattarci.</p>
      
      <div style="text-align: center;">
        <a href="https://www.martello1930.net" class="cta-button">Visita il Nostro Sito</a>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Martello1930</strong><br>
      Strutture in Legno su Misura</p>
      <p>
        📧 <a href="mailto:${process.env.GMAIL_USER}">${process.env.GMAIL_USER}</a><br>
        🌐 <a href="https://www.martello1930.net">www.martello1930.net</a>
      </p>
      <p style="font-size: 12px; color: #999; margin-top: 15px;">
        Questa email è stata generata automaticamente dal configuratore Martello1930.<br>
        Per qualsiasi problema, rispondi direttamente a questa email.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Template email notifica admin
 */
export function generateAdminNotificationEmail(data: ConfigurationEmailData): string {
  return `
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 700px;
      margin: 0 auto;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      background: white;
      margin: 20px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      color: white;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    }
    .alert-badge {
      display: inline-block;
      background: rgba(255,255,255,0.2);
      padding: 5px 15px;
      border-radius: 20px;
      margin-top: 10px;
      font-size: 14px;
    }
    .content {
      padding: 25px;
    }
    .section {
      margin-bottom: 20px;
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      border-left: 4px solid #dc2626;
    }
    .section h2 {
      color: #dc2626;
      font-size: 16px;
      margin: 0 0 10px 0;
    }
    .grid {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 8px;
    }
    .label {
      font-weight: 600;
      color: #666;
    }
    .value {
      color: #333;
    }
    .price-highlight {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      padding: 15px;
      text-align: center;
      font-size: 24px;
      font-weight: 700;
      color: #b45309;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      background: #f8f9fa;
      padding: 15px;
      text-align: center;
      font-size: 13px;
      color: #666;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Nuova Configurazione Legno Ricevuta</h1>
      <div class="alert-badge">AZIONE RICHIESTA</div>
    </div>
    
    <div class="content">
      <p style="font-size: 15px; margin-bottom: 20px;">È arrivata una <strong>nuova richiesta di preventivo</strong> dal configuratore legno. Segui il cliente entro 24 ore.</p>
      
      <div class="section">
        <h2>👤 Dati Cliente</h2>
        <div class="grid">
          <span class="label">Nome:</span>
          <span class="value">${data.customerName}</span>
          
          <span class="label">Email:</span>
          <span class="value"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></span>
          
          <span class="label">Telefono:</span>
          <span class="value"><a href="tel:${data.customerPhone}">${data.customerPhone}</a></span>
          
          <span class="label">Indirizzo:</span>
          <span class="value">${data.customerAddress}</span>
          
          <span class="label">Città:</span>
          <span class="value">${data.customerCity} ${data.customerCap} (${data.customerProvince})</span>
          
          <span class="label">Contatto Preferito:</span>
          <span class="value"><strong>${data.contactPreference}</strong></span>
        </div>
      </div>
      
      <div class="section">
        <h2>🏗️ Configurazione Struttura</h2>
        <div class="grid">
          <span class="label">Tipo Struttura:</span>
          <span class="value">${data.structureType}</span>
          
          <span class="label">Modello:</span>
          <span class="value">${data.modelName}</span>
          
          <span class="label">Dimensioni:</span>
          <span class="value">${data.dimensions.width}cm (L) × ${data.dimensions.depth}cm (P) × ${data.dimensions.height}cm (H)</span>
          
          <span class="label">Copertura:</span>
          <span class="value">${data.coverageType}</span>
          
          <span class="label">Colore Legno:</span>
          <span class="value">${data.colorName}</span>
          
          <span class="label">Superficie:</span>
          <span class="value">${data.surfaceName}</span>
          
          <span class="label">Pacchetto:</span>
          <span class="value">${data.packageType}</span>
        </div>
      </div>
      
      <div class="price-highlight">
        💰 Prezzo Calcolato: €${data.totalPrice.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      
      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 5px; margin-top: 20px;">
        <p style="margin: 0; color: #1e40af;"><strong>⏰ Prossimi Step:</strong></p>
        <ol style="margin: 10px 0 0 0; padding-left: 20px; color: #1e40af;">
          <li>Verifica dati cliente su Notion/Database</li>
          <li>Calcola preventivo dettagliato considerando installazione</li>
          <li>Contatta cliente via ${data.contactPreference} entro 24h</li>
          <li>Invia preventivo ufficiale personalizzato</li>
        </ol>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>Configuratore Martello1930</strong> - Notifica Automatica</p>
      <p style="font-size: 12px; color: #999; margin-top: 10px;">
        Timestamp: ${new Date().toLocaleString('it-IT', { timeZone: 'Europe/Rome' })}
      </p>
    </div>
  </div>
</body>
</html>
  `
}
