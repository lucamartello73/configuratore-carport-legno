"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminLayout } from "@/components/admin/admin-layout"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Surface {
  id: string
  name: string
  description: string
  price_per_sqm: number
}

export default function SurfacesPage() {
  const [surfaces, setSurfaces] = useState<Surface[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingSurface, setEditingSurface] = useState<Partial<Surface>>({})

  useEffect(() => {
    fetchSurfaces()
  }, [])

  const fetchSurfaces = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("carport_surfaces").select("*").order("name")

    if (error) {
      console.error("Error fetching surfaces:", error)
    } else {
      setSurfaces(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    const supabase = createClient()

    if (editingSurface.id) {
      // Update existing surface
      const { error } = await supabase
        .from("carport_surfaces")
        .update({
          name: editingSurface.name,
          description: editingSurface.description,
          price_per_sqm: editingSurface.price_per_sqm,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingSurface.id)

      if (error) {
        console.error("Error updating surface:", error)
        return
      }
    } else {
      // Create new surface
      const { error } = await supabase.from("carport_surfaces").insert([
        {
          name: editingSurface.name,
          description: editingSurface.description,
          price_per_sqm: editingSurface.price_per_sqm,
        },
      ])

      if (error) {
        console.error("Error creating surface:", error)
        return
      }
    }

    setIsEditing(false)
    setEditingSurface({})
    fetchSurfaces()
  }

  const handleEdit = (surface: Surface) => {
    setEditingSurface(surface)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa superficie?")) return

    const supabase = createClient()
    const { error } = await supabase.from("carport_surfaces").delete().eq("id", id)

    if (error) {
      console.error("Error deleting surface:", error)
    } else {
      fetchSurfaces()
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingSurface({})
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-8 text-green-600">Caricamento superfici...</div>
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
              <CardTitle className="text-green-800">
                {editingSurface.id ? "Modifica Superficie" : "Nuova Superficie"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editingSurface.name || ""}
                  onChange={(e) => setEditingSurface({ ...editingSurface, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={editingSurface.description || ""}
                  onChange={(e) => setEditingSurface({ ...editingSurface, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price_per_sqm">Prezzo per m² (€)</Label>
                <Input
                  id="price_per_sqm"
                  type="number"
                  step="0.01"
                  value={editingSurface.price_per_sqm || ""}
                  onChange={(e) => setEditingSurface({ ...editingSurface, price_per_sqm: Number(e.target.value) })}
                />
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

        {/* Surfaces List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-800">Superfici ({surfaces.length})</CardTitle>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nuova Superficie
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {surfaces.map((surface) => (
                <div key={surface.id} className="border rounded-lg p-4 bg-green-50">
                  <h3 className="font-semibold text-green-800 mb-2">{surface.name}</h3>
                  <p className="text-green-600 text-sm mb-3">{surface.description}</p>
                  <p className="font-semibold text-green-800 mb-4">€{surface.price_per_sqm}/m²</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(surface)} className="bg-transparent">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(surface.id)}
                      className="bg-transparent text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
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
