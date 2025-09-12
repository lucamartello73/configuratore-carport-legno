import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { image, filename } = await request.json()

    // Validate input
    if (!image || !filename) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    const base64Data = image.split(",")[1] || image
    const sizeInBytes = (base64Data.length * 3) / 4
    const maxSizeInMB = 5

    if (sizeInBytes > maxSizeInMB * 1024 * 1024) {
      return NextResponse.json({ success: false, error: "File size exceeds 5MB limit" }, { status: 400 })
    }

    const timestamp = Date.now()
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_")
    const imageUrl = `/placeholder.svg?height=300&width=400&query=${cleanFilename}-${timestamp}`

    return NextResponse.json({
      success: true,
      imageUrl,
    })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ success: false, error: "Failed to upload image" }, { status: 500 })
  }
}
