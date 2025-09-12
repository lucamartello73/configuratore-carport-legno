import { type NextRequest, NextResponse } from "next/server"
import { createColorServer, updateColorServer, deleteColorServer } from "@/lib/admin-database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, hex_value, category } = body

    if (!name || !hex_value || !category) {
      return NextResponse.json({ error: "Nome, valore hex e categoria sono obbligatori" }, { status: 400 })
    }

    if (!["smalto", "impregnante-legno", "impregnante-pastello"].includes(category)) {
      return NextResponse.json({ error: "Categoria non valida" }, { status: 400 })
    }

    await createColorServer({ name, hex_value, category })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating color:", error)
    return NextResponse.json({ error: "Errore nella creazione del colore" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, hex_value, category } = body

    if (!id || !name || !hex_value || !category) {
      return NextResponse.json({ error: "ID, nome, valore hex e categoria sono obbligatori" }, { status: 400 })
    }

    if (!["smalto", "impregnante-legno", "impregnante-pastello"].includes(category)) {
      return NextResponse.json({ error: "Categoria non valida" }, { status: 400 })
    }

    await updateColorServer(id, { name, hex_value, category })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating color:", error)
    return NextResponse.json({ error: "Errore nell'aggiornamento del colore" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID è obbligatorio" }, { status: 400 })
    }

    await deleteColorServer(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting color:", error)
    return NextResponse.json({ error: "Errore nell'eliminazione del colore" }, { status: 500 })
  }
}
