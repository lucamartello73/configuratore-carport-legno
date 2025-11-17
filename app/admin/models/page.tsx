"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ModernAdminWrapper } from "@/components/admin/modern-admin-wrapper"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2 } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"
import Image from "next/image"

interface Model {
  id: string
  name: string
  description: string
  base_price: number
  image: string
  structure_type_id: string | null
  structure_type: {
    name: string
    structure_category: string
  }
}

interface StructureType {
  id: string
  name: string
  structure_category: string
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [structureTypes, setStructureTypes] = useState<StructureType[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingModel, setEditingModel] = useState<Partial<Model>>({})

  useEffect(() => {
    fetchModels()
    fetchStructureTypes()
  }, [])

  const fetchStructureTypes = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("carport_structure_types")
      .select("id, name, structure_category")
      .eq("is_active", true)
      .order("name")

    if (error) {
      console.error("Error fetching structure types:", error)
    } else {
      setStructureTypes(data || [])
    }
  }

  const fetchModels = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("carport_models")
      .select(`
        *,
        structure_type:carport_structure_types!carport_models_structure_type_id_fkey(name, structure_category)
      `)
      .order("name")

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
      const { error } = await supabase
        .from("carport_models")
        .update({
          name: editingModel.name,
          description: editingModel.description,
          base_price: editingModel.base_price,
          image: editingModel.image,
          structure_type_id: editingModel.structure_type_id || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingModel.id)

      if (error) {
        console.error("Error updating model:", error)
        return
      }
    } else {
      const { error } = await supabase.from("carport_models").insert([
        {
          name: editingModel.name,
          description: editingModel.description,
          base_price: editingModel.base_price,
          image: editingModel.image,
          structure_type_id: editingModel.structure_type_id || null,
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

    const { data: configurationsUsingModel, error: checkError } = await supabase
      .from("carport_configurations")
      .select("id, customer_name")
      .eq("model_id", id)
      .limit(5)

    if (checkError) {
      console.error("Error checking model usage:", checkError)
      alert("Errore durante la verifica dell'utilizzo del modello")
      return
    }

    if (configurationsUsingModel && configurationsUsingModel.length > 0) {
      const customerNames = configurationsUsingModel.map((config) => config.customer_name).join(", ")
      const moreText = configurationsUsingModel.length === 5 ? " e altri..." : ""
      alert(
        `Impossibile eliminare il modello. È utilizzato in ${configurationsUsingModel.length} configurazione/i di: ${customerNames}${moreText}.\n\nElimina prima le configurazioni che utilizzano questo modello.`,
      )
      return
    }

    const { error } = await supabase.from("carport_models").delete().eq("id", id)

    if (error) {
      console.error("Error deleting model:", error)
      alert("Errore durante l'eliminazione del modello")
    } else {
      fetchModels()
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingModel({})
  }

  const getStructureTypeName = (model: any) => {
    if (model.structure_type) {
      return `${model.structure_type.name} (${model.structure_type.structure_category})`
    }
    return "Nessun tipo assegnato"
  }

  if (loading) {
    return (
      <ModernAdminWrapper title="Modelli">
        <div className="text-center py-8 text-green-600">Caricamento modelli...</div>
      </ModernAdminWrapper>
    )
  }

  return (
    <ModernAdminWrapper title="Modelli">
      <div className="space-y-6">
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
                <Label htmlFor="structure_type">Tipo di Struttura</Label>
                <select
                  id="structure_type"
                  value={editingModel.structure_type_id || ""}
                  onChange={(e) => setEditingModel({ ...editingModel, structure_type_id: e.target.value || null })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Seleziona tipo di struttura</option>
                  {structureTypes.map((structureType) => (
                    <option key={structureType.id} value={structureType.id}>
                      {structureType.name} ({structureType.structure_category})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Collega questo modello a un tipo di struttura per filtrare le opzioni nel configuratore
                </p>
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
                  <Image
                    src={model.image || "/placeholder.svg?height=200&width=300&query=carport model"}
                    alt={model.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                  <h3 className="font-semibold text-green-800 mb-2">{model.name}</h3>
                  <p className="text-green-600 text-sm mb-3">{model.description}</p>
                  <p className="text-xs text-gray-600 mb-2">
                    <strong>Tipo:</strong> {getStructureTypeName(model)}
                  </p>
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
    </ModernAdminWrapper>
  )
}
