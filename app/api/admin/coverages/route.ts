import { type NextRequest, NextResponse } from "next/server"
import { createCoverageTypeServer, updateCoverageTypeServer, deleteCoverageTypeServer } from "@/lib/admin-database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image } = body

    if (!name || !description) {
      return NextResponse.json({ error: "Nome e descrizione sono obbligatori" }, { status: 400 })
    }

    await createCoverageTypeServer({ name, description, image })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating coverage type:", error)
    return NextResponse.json({ error: "Errore nella creazione della copertura" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, image } = body

    if (!id || !name || !description) {
      return NextResponse.json({ error: "ID, nome e descrizione sono obbligatori" }, { status: 400 })
    }

    await updateCoverageTypeServer(id, { name, description, image })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating coverage type:", error)
    return NextResponse.json({ error: "Errore nell'aggiornamento della copertura" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID è obbligatorio" }, { status: 400 })
    }

    await deleteCoverageTypeServer(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting coverage type:", error)
    return NextResponse.json({ error: "Errore nell'eliminazione della copertura" }, { status: 500 })
  }
}
