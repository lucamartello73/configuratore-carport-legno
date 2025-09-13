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
import { ImageUpload } from "@/components/admin/image-upload"

interface Model {
  id: string
  name: string
  description: string
  base_price: number
  image: string
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingModel, setEditingModel] = useState<Partial<Model>>({})

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("carport_models").select("*").order("name")

    if (error) {
      console.error("Error fetching models:", error)
    } else {
      setModels(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    const supabase = createClient()

    if (editingModel.id) {
      // Update existing model
      const { error } = await supabase
        .from("carport_models")
        .update({
          name: editingModel.name,
          description: editingModel.description,
          base_price: editingModel.base_price,
          image: editingModel.image,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingModel.id)

      if (error) {
        console.error("Error updating model:", error)
        return
      }
    } else {
      // Create new model
      const { error } = await supabase.from("carport_models").insert([
        {
          name: editingModel.name,
          description: editingModel.description,
          base_price: editingModel.base_price,
          image: editingModel.image,
        },
      ])

      if (error) {
        console.error("Error creating model:", error)
        return
      }
    }

    setIsEditing(false)
    setEditingModel({})
    fetchModels()
  }

  const handleEdit = (model: Model) => {
    setEditingModel(model)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo modello?")) return

    const supabase = createClient()
    const { error } = await supabase.from("carport_models").delete().eq("id", id)

    if (error) {
      console.error("Error deleting model:", error)
    } else {
      fetchModels()
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingModel({})
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-8 text-green-600">Caricamento modelli...</div>
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
              <CardTitle className="text-green-800">{editingModel.id ? "Modifica Modello" : "Nuovo Modello"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editingModel.name || ""}
                  onChange={(e) => setEditingModel({ ...editingModel, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={editingModel.description || ""}
                  onChange={(e) => setEditingModel({ ...editingModel, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="base_price">Prezzo Base (€)</Label>
                <Input
                  id="base_price"
                  type="number"
                  value={editingModel.base_price || ""}
                  onChange={(e) => setEditingModel({ ...editingModel, base_price: Number(e.target.value) })}
                />
              </div>
              <div>
                <ImageUpload
                  currentImage={editingModel.image}
                  onImageUploaded={(url) => setEditingModel({ ...editingModel, image: url })}
                  folder="models"
                  label="Immagine Modello"
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

        {/* Models List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-800">Modelli ({models.length})</CardTitle>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nuovo Modello
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {models.map((model) => (
                <div key={model.id} className="border rounded-lg p-4 bg-green-50">
                  <img
                    src={model.image || "/placeholder.svg?height=200&width=300&query=carport model"}
                    alt={model.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                  <h3 className="font-semibold text-green-800 mb-2">{model.name}</h3>
                  <p className="text-green-600 text-sm mb-3">{model.description}</p>
                  <p className="font-semibold text-green-800 mb-4">€{model.base_price.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(model)} className="bg-transparent">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(model.id)}
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
