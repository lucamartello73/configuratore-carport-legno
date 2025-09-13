"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminLayout } from "@/components/admin/admin-layout"
import { getColors, createColor, updateColor, deleteColor } from "@/lib/actions/admin-colors"
import { PlusIcon, EditIcon, TrashIcon } from "@/components/ui/simple-icons"

interface Color {
  id: string // Changed from number to string since database uses UUID
  name: string
  hex_value: string // Changed from hex_code to hex_value to match database schema
  price_modifier: number
}

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingColor, setEditingColor] = useState<Partial<Color>>({})

  useEffect(() => {
    fetchColors()
  }, [])

  const fetchColors = async () => {
    try {
      const data = await getColors()
      setColors(data || [])
    } catch (error) {
      console.error("Error fetching colors:", error)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    try {
      if (editingColor.id) {
        // Update existing color
        await updateColor(editingColor.id, {
          name: editingColor.name!,
          hex_value: editingColor.hex_value!, // Changed from hex_code to hex_value
          price_modifier: editingColor.price_modifier!,
        })
      } else {
        // Create new color
        await createColor({
          name: editingColor.name!,
          hex_value: editingColor.hex_value!, // Changed from hex_code to hex_value
          price_modifier: editingColor.price_modifier!,
        })
      }

      setIsEditing(false)
      setEditingColor({})
      fetchColors()
    } catch (error) {
      console.error("Error saving color:", error)
    }
  }

  const handleEdit = (color: Color) => {
    setEditingColor(color)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    // Changed from number to string
    if (!confirm("Sei sicuro di voler eliminare questo colore?")) return

    try {
      await deleteColor(id)
      fetchColors()
    } catch (error) {
      console.error("Error deleting color:", error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingColor({})
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-8 text-green-600">Caricamento colori...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Add/Edit Form */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">{editingColor.id ? "Modifica Colore" : "Nuovo Colore"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={editingColor.name || ""}
                    onChange={(e) => setEditingColor({ ...editingColor, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="hex_value">Codice Colore (Hex)</Label> {/* Updated label for hex_value */}
                  <div className="flex gap-2">
                    <Input
                      id="hex_value" // Changed from hex_code to hex_value
                      value={editingColor.hex_value || ""} // Changed from hex_code to hex_value
                      onChange={(e) => setEditingColor({ ...editingColor, hex_value: e.target.value })} // Changed from hex_code to hex_value
                      placeholder="#000000"
                    />
                    <div
                      className="w-12 h-10 rounded border"
                      style={{ backgroundColor: editingColor.hex_value || "#ffffff" }} // Changed from hex_code to hex_value
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="price_modifier">Modificatore Prezzo (€)</Label>
                  <Input
                    id="price_modifier"
                    type="number"
                    value={editingColor.price_modifier || ""}
                    onChange={(e) => setEditingColor({ ...editingColor, price_modifier: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white">
                  Salva
                </Button>
                <Button variant="outline" onClick={handleCancel} className="bg-transparent">
                  Annulla
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Colors List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-800">Colori ({colors.length})</CardTitle>
              <Button
                onClick={() => {
                  setEditingColor({})
                  setIsEditing(true)
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Nuovo Colore
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {colors.map((color) => (
                <div key={color.id} className="border rounded-lg p-4 bg-green-50">
                  <div className="w-full h-16 rounded-lg mb-2 border" style={{ backgroundColor: color.hex_value }} />{" "}
                  {/* Changed from hex_code to hex_value */}
                  <h3 className="font-semibold text-green-800 text-sm mb-1">{color.name}</h3>
                  <p className="text-xs text-green-600 mb-2">
                    {color.price_modifier > 0 ? `+€${color.price_modifier}` : "Incluso"}
                  </p>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(color)}
                      className="bg-transparent p-1"
                    >
                      <EditIcon className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(color.id)}
                      className="bg-transparent text-red-600 border-red-300 hover:bg-red-50 p-1"
                    >
                      <TrashIcon className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
