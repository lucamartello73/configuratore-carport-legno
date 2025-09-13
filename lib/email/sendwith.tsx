interface EmailData {
  to: string
  subject: string
  html: string
  from?: string
}

interface ConfigurationEmailData {
  customerName: string
  customerEmail: string
  configurationId: string
  totalPrice: number
  structureType: string
  dimensions: string
}

export async function sendEmail(emailData: EmailData) {
  const apiKey = process.env.SENDWITH_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL || "admin@carport.com"

  if (!apiKey) {
    console.error("SENDWITH_API_KEY not configured")
    return { success: false, error: "Email service not configured" }
  }

  try {
    const response = await fetch("https://api.sendwith.email/api/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        message: {
          to: {
            email: emailData.to,
            name: "",
          },
          from: {
            email: emailData.from || adminEmail,
            name: "Carport Configurator",
          },
          subject: emailData.subject,
          body: "Configurazione carport ricevuta. Controlla l'email HTML per i dettagli completi.",
          HTMLbody: emailData.html,
        },
      }),
    })

    const responseText = await response.text()

    if (!response.ok) {
      console.error(`SendWith API error: ${response.status} ${response.statusText}`, responseText)
      throw new Error(`SendWith API error: ${response.statusText} - ${responseText}`)
    }

    // Try to parse as JSON
    let result
    try {
      result = JSON.parse(responseText)
    } catch (jsonError) {
      console.error("Failed to parse JSON response:", responseText)
      throw new Error(`Invalid JSON response from SendWith API: ${responseText}`)
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendConfigurationNotification(data: ConfigurationEmailData) {
  const customerEmailHtml = `
    <div>
      <h1>Configurazione Carport Ricevuta</h1>
      
      <p>Gentile ${data.customerName},</p>
      
      <p>Grazie per aver configurato il tuo carport personalizzato. Abbiamo ricevuto la tua richiesta e ti contatteremo presto per finalizzare il progetto.</p>
      
      <h3>Dettagli Configurazione</h3>
      <p><strong>ID Configurazione:</strong> ${data.configurationId}</p>
      <p><strong>Tipo Struttura:</strong> ${data.structureType}</p>
      <p><strong>Dimensioni:</strong> ${data.dimensions}</p>
      <p><strong>Prezzo Totale:</strong> €${data.totalPrice.toLocaleString()}</p>
      
      <p>Il nostro team tecnico esaminerà la tua configurazione e ti contatterà entro 24-48 ore per discutere i dettagli e organizzare un sopralluogo.</p>
      
      <p><strong>Prezzo Totale: €${data.totalPrice.toLocaleString()}</strong></p>
      
      <p>Se hai domande, non esitare a contattarci. Grazie per aver scelto i nostri servizi!</p>
      
      <p>Carport Configurator - Il tuo partner per carport personalizzati</p>
    </div>
  `

  const adminEmailHtml = `
    <div>
      <h1>Nuova Configurazione Carport</h1>
      
      <p>È stata ricevuta una nuova configurazione carport.</p>
      
      <h3>Dettagli Cliente</h3>
      <p><strong>Nome:</strong> ${data.customerName}</p>
      <p><strong>Email:</strong> ${data.customerEmail}</p>
      <p><strong>ID Configurazione:</strong> ${data.configurationId}</p>
      
      <h3>Dettagli Configurazione</h3>
      <p><strong>Tipo Struttura:</strong> ${data.structureType}</p>
      <p><strong>Dimensioni:</strong> ${data.dimensions}</p>
      <p><strong>Prezzo Totale:</strong> €${data.totalPrice.toLocaleString()}</p>
      
      <p><strong>Accedi al pannello admin per visualizzare i dettagli completi</strong></p>
    </div>
  `

  // Send email to customer
  const customerResult = await sendEmail({
    to: data.customerEmail,
    subject: "Configurazione Carport Ricevuta - Grazie per la tua richiesta",
    html: customerEmailHtml,
  })

  // Send notification to admin
  const adminResult = await sendEmail({
    to: process.env.ADMIN_EMAIL || "admin@carport.com",
    subject: `Nuova Configurazione Carport - ${data.customerName}`,
    html: adminEmailHtml,
  })

  return {
    customerEmail: customerResult,
    adminEmail: adminResult,
  }
}
