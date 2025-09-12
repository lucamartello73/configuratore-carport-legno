import { type NextRequest, NextResponse } from "next/server"
import { createStructureTypeServer, updateStructureTypeServer, deleteStructureTypeServer } from "@/lib/admin-database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, image } = body

    if (!name || !description) {
      return NextResponse.json({ error: "Nome e descrizione sono obbligatori" }, { status: 400 })
    }

    await createStructureTypeServer({ name, description, image })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating structure type:", error)
    return NextResponse.json({ error: "Errore nella creazione della struttura" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, description, image } = body

    if (!id || !name || !description) {
      return NextResponse.json({ error: "ID, nome e descrizione sono obbligatori" }, { status: 400 })
    }

    await updateStructureTypeServer(id, { name, description, image })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating structure type:", error)
    return NextResponse.json({ error: "Errore nell'aggiornamento della struttura" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID è obbligatorio" }, { status: 400 })
    }

    await deleteStructureTypeServer(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting structure type:", error)
    return NextResponse.json({ error: "Errore nell'eliminazione della struttura" }, { status: 500 })
  }
}
