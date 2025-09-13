"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

interface ImageUploadProps {
  currentImage?: string
  onImageUploaded: (url: string) => void
  bucket?: string
  folder?: string
  label?: string
}

export function ImageUpload({
  currentImage,
  onImageUploaded,
  bucket = "images",
  folder = "carport",
  label = "Immagine",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentImage || "")

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const supabase = createClient()

      // Create unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage.from(bucket).upload(fileName, file)

      if (error) {
        console.error("Error uploading file:", error)
        alert("Errore durante il caricamento del file")
        return
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fileName)

      setPreviewUrl(publicUrl)
      onImageUploaded(publicUrl)
    } catch (error) {
      console.error("Error:", error)
      alert("Errore durante il caricamento")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-upload">{label}</Label>
        <div className="flex gap-2 items-end">
          <Input
            id="image-url"
            placeholder="URL immagine"
            value={previewUrl}
            onChange={(e) => {
              setPreviewUrl(e.target.value)
              onImageUploaded(e.target.value)
            }}
            className="flex-1"
          />
          <div className="relative">
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button type="button" disabled={uploading} className="bg-green-600 hover:bg-green-700 text-white">
              {uploading ? "Caricamento..." : "Carica File"}
            </Button>
          </div>
        </div>
      </div>

      {previewUrl && (
        <div className="mt-4">
          <img
            src={previewUrl || "/placeholder.svg"}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
      )}
    </div>
  )
}
