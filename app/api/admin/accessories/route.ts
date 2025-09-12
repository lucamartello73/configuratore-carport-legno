import { type NextRequest, NextResponse } from "next/server"
import { createAccessoryServer, updateAccessoryServer, deleteAccessoryServer } from "@/lib/admin-database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, icon, image } = body

    if (!name || !icon) {
      return NextResponse.json({ error: "Nome e icona sono obbligatori" }, { status: 400 })
    }

    await createAccessoryServer({ name, icon, image })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating accessory:", error)
    return NextResponse.json({ error: "Errore nella creazione dell'accessorio" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, icon, image } = body

    if (!id || !name || !icon) {
      return NextResponse.json({ error: "ID, nome e icona sono obbligatori" }, { status: 400 })
    }

    await updateAccessoryServer(id, { name, icon, image })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating accessory:", error)
    return NextResponse.json({ error: "Errore nell'aggiornamento dell'accessorio" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID è obbligatorio" }, { status: 400 })
    }

    await deleteAccessoryServer(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting accessory:", error)
    return NextResponse.json({ error: "Errore nell'eliminazione dell'accessorio" }, { status: 500 })
  }
}
