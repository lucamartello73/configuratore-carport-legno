import { type NextRequest, NextResponse } from "next/server"
import type { CustomerData, ConfigurationData } from "@/lib/database"

interface EmailRequest {
  customerData: CustomerData
  configuration: ConfigurationData
  configurationId: string
}

export async function POST(request: NextRequest) {
  try {
    const { customerData, configuration, configurationId }: EmailRequest = await request.json()

    // Validate required data
    if (!customerData || !configuration || !configurationId) {
      return NextResponse.json({ success: false, error: "Missing required data" }, { status: 400 })
    }

    // Generate email content
    const emailHtml = generateEmailTemplate(customerData, configuration, configurationId)

    // In a real implementation, you would use a service like:
    // - Resend
    // - SendGrid
    // - Nodemailer with SMTP
    // - AWS SES

    // For demonstration, we'll simulate the email sending
    console.log("Sending email to:", customerData.email)
    console.log("Email content:", emailHtml)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Also send notification to admin
    const adminEmailHtml = generateAdminEmailTemplate(customerData, configuration, configurationId)
    console.log("Sending admin notification to: info@martello1930.it")
    console.log("Admin email content:", adminEmailHtml)

    return NextResponse.json({
      success: true,
      messageId: `msg_${configurationId.slice(0, 8)}`,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}

function generateEmailTemplate(customerData: CustomerData, configuration: ConfigurationData, configurationId: string) {
  return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Richiesta Preventivo - MARTELLO 1930</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background-color: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
            padding-bottom: 24px;
            border-bottom: 2px solid #047857;
        }
        .logo {
            width: 60px;
            height: 60px;
            background-color: #047857;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 16px;
        }
        .title {
            color: #047857;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
        }
        .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin: 8px 0 0 0;
        }
        .section {
            margin-bottom: 24px;
        }
        .section-title {
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }
        .detail-item {
            background-color: #f3f4f6;
            padding: 12px;
            border-radius: 8px;
        }
        .detail-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .detail-value {
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
        }
        .color-preview {
            width: 24px;
            height: 24px;
            border-radius: 4px;
            display: inline-block;
            margin-right: 8px;
            vertical-align: middle;
            border: 1px solid #d1d5db;
        }
        .accessories-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .accessories-list li {
            background-color: #ecfdf5;
            color: #047857;
            padding: 8px 12px;
            margin: 4px 0;
            border-radius: 6px;
            font-size: 14px;
        }
        .config-id {
            background-color: #fef3c7;
            color: #92400e;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            font-family: monospace;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 1px;
        }
        .next-steps {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 16px;
            margin: 24px 0;
        }
        .contact-info {
            background-color: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-top: 24px;
        }
        .contact-item {
            margin: 8px 0;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">M</div>
            <h1 class="title">MARTELLO 1930</h1>
            <p class="subtitle">Pergole in Legno Artigianali</p>
        </div>

        <div class="section">
            <h2 class="section-title">Gentile ${customerData.firstName} ${customerData.lastName},</h2>
            <p>Grazie per aver utilizzato il nostro configuratore! Abbiamo ricevuto la sua richiesta di preventivo per una pergola personalizzata.</p>
        </div>

        <div class="section">
            <h2 class="section-title">ID Richiesta</h2>
            <div class="config-id">${configurationId.slice(0, 8).toUpperCase()}</div>
            <p style="text-align: center; font-size: 14px; color: #6b7280; margin-top: 8px;">
                Conservi questo codice per future comunicazioni
            </p>
        </div>

        <div class="section">
            <h2 class="section-title">Dettagli Configurazione</h2>
            
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">Larghezza</div>
                    <div class="detail-value">${configuration.width} cm</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Profondità</div>
                    <div class="detail-value">${configuration.depth} cm</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Altezza</div>
                    <div class="detail-value">${configuration.height} cm</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Superficie</div>
                    <div class="detail-value">${((configuration.width * configuration.depth) / 10000).toFixed(1)} m²</div>
                </div>
            </div>

            <div class="detail-item" style="margin-bottom: 16px;">
                <div class="detail-label">Colore Selezionato</div>
                <div class="detail-value">
                    <span class="color-preview" style="background-color: ${configuration.color_value}"></span>
                    ${configuration.color_name}
                </div>
            </div>

            <div class="detail-item" style="margin-bottom: 16px;">
                <div class="detail-label">Tipo di Servizio</div>
                <div class="detail-value">${configuration.service_type === "chiavi-in-mano" ? "Chiavi in Mano" : "Fai da Te"}</div>
            </div>

            ${
              configuration.accessories && configuration.accessories.length > 0
                ? `
            <div class="detail-item">
                <div class="detail-label">Accessori Selezionati</div>
                <ul class="accessories-list">
                    ${configuration.accessories.map((acc: any) => `<li>• ${acc.name || acc}</li>`).join("")}
                </ul>
            </div>
            `
                : ""
            }
        </div>

        <div class="next-steps">
            <h3 style="margin-top: 0; color: #1e40af;">Prossimi Passi</h3>
            <ol style="margin: 0; padding-left: 20px;">
                <li><strong>Elaborazione:</strong> Il nostro team tecnico analizzerà la sua richiesta</li>
                <li><strong>Contatto:</strong> La contatteremo entro 24 ore per discutere i dettagli</li>
                <li><strong>Preventivo:</strong> Riceverà un preventivo dettagliato personalizzato</li>
                <li><strong>Sopralluogo:</strong> Se necessario, organizzeremo un sopralluogo gratuito</li>
            </ol>
        </div>

        <div class="contact-info">
            <h3 style="margin-top: 0; color: #047857;">Informazioni di Contatto</h3>
            <div class="contact-item"><strong>Email:</strong> info@martello1930.it</div>
            <div class="contact-item"><strong>Telefono:</strong> +39 0123 456 789</div>
            <div class="contact-item"><strong>WhatsApp:</strong> +39 333 123 4567</div>
            <div class="contact-item"><strong>Orari:</strong> Lun-Ven 8:00-18:00, Sab 8:00-12:00</div>
        </div>

        <div class="footer">
            <p>Questa email è stata generata automaticamente dal configuratore MARTELLO 1930.</p>
            <p>© 2024 MARTELLO 1930 - Pergole in Legno Artigianali dal 1930</p>
        </div>
    </div>
</body>
</html>
  `
}

function generateAdminEmailTemplate(
  customerData: CustomerData,
  configuration: ConfigurationData,
  configurationId: string,
) {
  return `
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nuova Richiesta Preventivo - Admin</title>
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            line-height: 1.6;
            color: #374151;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background-color: white;
            border-radius: 12px;
            padding: 32px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #dc2626;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 24px;
        }
        .urgent {
            background-color: #fef2f2;
            border-left: 4px solid #dc2626;
            padding: 16px;
            margin-bottom: 24px;
        }
        .customer-info {
            background-color: #f0f9ff;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        .config-details {
            background-color: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .label {
            font-weight: 600;
            color: #374151;
        }
        .value {
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">🚨 NUOVA RICHIESTA PREVENTIVO</h1>
            <p style="margin: 8px 0 0 0;">ID: ${configurationId.slice(0, 8).toUpperCase()}</p>
        </div>

        <div class="urgent">
            <h3 style="margin-top: 0; color: #dc2626;">Azione Richiesta</h3>
            <p>Una nuova richiesta di preventivo è stata ricevuta e richiede attenzione entro 24 ore.</p>
        </div>

        <div class="customer-info">
            <h3 style="margin-top: 0; color: #1e40af;">Dati Cliente</h3>
            <div class="detail-row">
                <span class="label">Nome:</span>
                <span class="value">${customerData.firstName} ${customerData.lastName}</span>
            </div>
            <div class="detail-row">
                <span class="label">Email:</span>
                <span class="value">${customerData.email}</span>
            </div>
            <div class="detail-row">
                <span class="label">Telefono:</span>
                <span class="value">${customerData.phone}</span>
            </div>
            <div class="detail-row">
                <span class="label">Indirizzo:</span>
                <span class="value">${customerData.address}</span>
            </div>
            <div class="detail-row">
                <span class="label">Preferenza Contatto:</span>
                <span class="value">${configuration.contact_preference}</span>
            </div>
        </div>

        <div class="config-details">
            <h3 style="margin-top: 0; color: #047857;">Dettagli Configurazione</h3>
            <div class="detail-row">
                <span class="label">Dimensioni:</span>
                <span class="value">${configuration.width} × ${configuration.depth} × ${configuration.height} cm</span>
            </div>
            <div class="detail-row">
                <span class="label">Superficie:</span>
                <span class="value">${((configuration.width * configuration.depth) / 10000).toFixed(1)} m²</span>
            </div>
            <div class="detail-row">
                <span class="label">Colore:</span>
                <span class="value">${configuration.color_name}</span>
            </div>
            <div class="detail-row">
                <span class="label">Tipo Servizio:</span>
                <span class="value">${configuration.service_type === "chiavi-in-mano" ? "Chiavi in Mano" : "Fai da Te"}</span>
            </div>
            ${
              configuration.accessories && configuration.accessories.length > 0
                ? `
            <div class="detail-row">
                <span class="label">Accessori:</span>
                <span class="value">${configuration.accessories.length} selezionati</span>
            </div>
            `
                : ""
            }
        </div>

        <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; text-align: center;">
            <h3 style="margin-top: 0; color: #92400e;">Prossime Azioni</h3>
            <p style="margin-bottom: 0;">
                1. Contattare il cliente entro 24 ore<br>
                2. Preparare preventivo dettagliato<br>
                3. Valutare necessità sopralluogo
            </p>
        </div>
    </div>
</body>
</html>
  `
}
