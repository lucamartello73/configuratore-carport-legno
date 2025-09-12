import { type NextRequest, NextResponse } from "next/server"
import { getConfigurationsServer, deleteConfigurationServer } from "@/lib/admin-database"

export async function GET() {
  try {
    const configurations = await getConfigurationsServer()
    return NextResponse.json(configurations)
  } catch (error) {
    console.error("Error fetching configurations:", error)
    return NextResponse.json({ error: "Failed to fetch configurations" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Configuration ID required" }, { status: 400 })
    }

    await deleteConfigurationServer(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting configuration:", error)
    return NextResponse.json({ error: "Failed to delete configuration" }, { status: 500 })
  }
}
