import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email/send-email"
import {
  generateCustomerConfirmationEmail,
  generateAdminNotificationEmail,
} from "@/lib/email/templates"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    console.log("[EMAIL] Ricevuta richiesta invio email per configurazione:", {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
    })

    // Validazione dati obbligatori
    if (!data.customerEmail || !data.customerName) {
      return NextResponse.json(
        { error: "Email e nome cliente obbligatori" },
        { status: 400 }
      )
    }

    // Validazione email formato
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.customerEmail)) {
      return NextResponse.json(
        { error: "Formato email non valido" },
        { status: 400 }
      )
    }

    // Genera template HTML
    const customerEmailHtml = generateCustomerConfirmationEmail(data)
    const adminEmailHtml = generateAdminNotificationEmail(data)

    // Invia email al cliente
    console.log("[EMAIL] Invio email conferma a cliente:", data.customerEmail)
    await sendEmail(
      data.customerEmail,
      "✅ Configurazione Ricevuta - Martello1930",
      customerEmailHtml
    )

    // Invia email notifica admin
    const adminEmail = process.env.GMAIL_USER
    if (!adminEmail) {
      console.warn("[EMAIL] ⚠️ GMAIL_USER non configurato, skip notifica admin")
    } else {
      console.log("[EMAIL] Invio notifica admin a:", adminEmail)
      await sendEmail(
        adminEmail,
        `🔔 Nuova Configurazione Legno - ${data.customerName}`,
        adminEmailHtml
      )
    }

    console.log("[EMAIL] ✅ Email inviate con successo")

    return NextResponse.json({
      success: true,
      message: "Email inviate correttamente",
    })
  } catch (error: any) {
    console.error("❌ Errore invio email:", error)

    // Log dettagliato per debug
    if (error.code === "EAUTH") {
      console.error("❌ Errore autenticazione Gmail - Verifica GMAIL_USER e GMAIL_APP_PASSWORD")
    } else if (error.code === "ECONNECTION") {
      console.error("❌ Errore connessione SMTP Gmail")
    }

    return NextResponse.json(
      {
        error: "Errore nell'invio delle email",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}
