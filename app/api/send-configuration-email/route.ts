import { type NextRequest, NextResponse } from "next/server"
import { sendConfigurationNotification } from "@/lib/email/sendwith"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerName, customerEmail, configurationId, totalPrice, structureType, dimensions } = body

    if (!customerName || !customerEmail || !configurationId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await sendConfigurationNotification({
      customerName,
      customerEmail,
      configurationId,
      totalPrice,
      structureType,
      dimensions,
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error sending configuration email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
