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
    const requestBody = {
      to: emailData.to,
      from: emailData.from || adminEmail,
      subject: emailData.subject,
      text: emailData.html
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim(),
    }

    console.log("[v0] SendWith request body:", JSON.stringify(requestBody, null, 2))

    const response = await fetch("https://api.sendwith.me/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify(requestBody),
    })

    const responseText = await response.text()
    console.log("[v0] SendWith response:", response.status, responseText)

    if (!response.ok) {
      console.error(`SendWith API error: ${response.status} ${response.statusText}`, responseText)
      throw new Error(`SendWith API error: ${response.statusText} - ${responseText}`)
    }

    // Try to parse as JSON
    let result
    try {
      result = JSON.parse(responseText)
    } catch (jsonError) {
      // If it's not JSON, treat as success if status is OK
      result = { message: responseText }
    }

    return { success: true, data: result }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendConfigurationNotification(data: ConfigurationEmailData) {
  const customerEmailText = `
Configurazione Carport Ricevuta

Gentile ${data.customerName},

Grazie per aver configurato il tuo carport personalizzato. Abbiamo ricevuto la tua richiesta e ti contatteremo presto per finalizzare il progetto.

Dettagli Configurazione:
- ID Configurazione: ${data.configurationId}
- Tipo Struttura: ${data.structureType}
- Dimensioni: ${data.dimensions}

Il nostro team tecnico esaminerà la tua configurazione e ti contatterà entro 24-48 ore per discutere i dettagli, organizzare un sopralluogo e fornirti un preventivo personalizzato.

Se hai domande, non esitare a contattarci. Grazie per aver scelto i nostri servizi!

Carport Configurator - Il tuo partner per carport personalizzati
  `

  const adminEmailText = `
Nuova Configurazione Carport

È stata ricevuta una nuova configurazione carport.

Dettagli Cliente:
- Nome: ${data.customerName}
- Email: ${data.customerEmail}
- ID Configurazione: ${data.configurationId}

Dettagli Configurazione:
- Tipo Struttura: ${data.structureType}
- Dimensioni: ${data.dimensions}

Accedi al pannello admin per visualizzare i dettagli completi e calcolare il preventivo.
  `

  // Send email to customer
  const customerResult = await sendEmail({
    to: data.customerEmail,
    subject: "Configurazione Carport Ricevuta - Grazie per la tua richiesta",
    html: customerEmailText,
  })

  // Send notification to admin
  const adminResult = await sendEmail({
    to: process.env.ADMIN_EMAIL || "admin@carport.com",
    subject: `Nuova Configurazione Carport - ${data.customerName}`,
    html: adminEmailText,
  })

  return {
    customerEmail: customerResult,
    adminEmail: adminResult,
  }
}
