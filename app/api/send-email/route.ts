import { NextRequest, NextResponse } from 'next/server'
import { sendConfigurationEmail } from '@/lib/email/send-email'
import { verifyGmailConnection } from '@/lib/email/gmail-transport'
import type { ConfigurationData } from '@/types/configuration'

/**
 * POST /api/send-email
 * Invia email con configurazione carport/pergola
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerEmail, customerName, customerPhone, configuration, configuratorType } = body

    // Validazione input
    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { success: false, error: 'Email e nome cliente sono obbligatori' },
        { status: 400 }
      )
    }

    if (!configuration || !configuratorType) {
      return NextResponse.json(
        { success: false, error: 'Configurazione e tipo configuratore sono obbligatori' },
        { status: 400 }
      )
    }

    // Validazione email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { success: false, error: 'Formato email non valido' },
        { status: 400 }
      )
    }

    // Invia email
    await sendConfigurationEmail(
      configuration as Partial<ConfigurationData>,
      customerName,
      customerEmail,
      customerPhone,
      configuratorType as 'acciaio' | 'legno'
    )

    return NextResponse.json({
      success: true,
      message: 'Email inviata con successo',
    })
  } catch (error: any) {
    console.error('❌ Errore API send-email:', error)
    
    // Gestione errori specifici
    if (error.message?.includes('Gmail credentials not configured')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Servizio email non configurato. Contattare l\'amministratore.',
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Errore durante l\'invio dell\'email. Riprova più tardi.',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/send-email
 * Test endpoint per verificare connessione Gmail
 */
export async function GET() {
  try {
    const isConnected = await verifyGmailConnection()
    
    if (isConnected) {
      return NextResponse.json({
        success: true,
        message: 'Gmail connection verified',
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Gmail connection failed',
        },
        { status: 503 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Gmail connection test failed',
      },
      { status: 503 }
    )
  }
}
