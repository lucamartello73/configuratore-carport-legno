"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin/admin-layout"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"

interface StructureType {
  id: string
  name: string
  description: string
  image: string
  structure_category: string
  material_type: string
  features: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function StructureTypesPage() {
  const [structureTypes, setStructureTypes] = useState<StructureType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    structure_category: "",
    material_type: "",
    features: [""],
    is_active: true,
  })

  useEffect(() => {
    fetchStructureTypes()
  }, [])

  const fetchStructureTypes = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("carport_structure_types")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching structure types:", error)
    } else {
      setStructureTypes(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    const supabase = createClient()
    const dataToSave = {
      ...formData,
      features: formData.features.filter((f) => f.trim() !== ""),
    }

    let error
    if (editingId) {
      const { error: updateError } = await supabase
        .from("carport_structure_types")
        .update(dataToSave)
        .eq("id", editingId)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from("carport_structure_types").insert([dataToSave])
      error = insertError
    }

    if (error) {
      console.error("Error saving structure type:", error)
    } else {
      await fetchStructureTypes()
      resetForm()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo tipo di struttura?")) return

    const supabase = createClient()
    const { error } = await supabase.from("carport_structure_types").delete().eq("id", id)

    if (error) {
      console.error("Error deleting structure type:", error)
    } else {
      await fetchStructureTypes()
    }
  }

  const startEdit = (structureType: StructureType) => {
    setEditingId(structureType.id)
    setFormData({
      name: structureType.name,
      description: structureType.description,
      image: structureType.image,
      structure_category: structureType.structure_category,
      material_type: structureType.material_type,
      features: structureType.features.length > 0 ? structureType.features : [""],
      is_active: structureType.is_active,
    })
    setIsCreating(false)
  }

  const resetForm = () => {
    setEditingId(null)
    setIsCreating(false)
    setFormData({
      name: "",
      description: "",
      image: "",
      structure_category: "",
      material_type: "",
      features: [""],
      is_active: true,
    })
  }

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }))
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-8 text-green-600">Caricamento tipi di struttura...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Gestione Tipi di Struttura</h1>
          <Button onClick={() => setIsCreating(true)} className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nuovo Tipo
          </Button>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">
                {editingId ? "Modifica Tipo di Struttura" : "Nuovo Tipo di Struttura"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="es. Addossato"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <Select
                    value={formData.structure_category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, structure_category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="addossato">Addossato</SelectItem>
                      <SelectItem value="autoportante">Autoportante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Materiale</label>
                  <Select
                    value={formData.material_type}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, material_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona materiale" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="acciaio">Acciaio</SelectItem>
                      <SelectItem value="legno">Legno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <ImageUpload
                    currentImage={formData.image}
                    onImageUploaded={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                    folder="structure-types"
                    label="Immagine Tipo Struttura"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrizione del tipo di struttura..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Caratteristiche</label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="es. Facile installazione"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        disabled={formData.features.length === 1}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="w-4 h-4 mr-2" />
                    Aggiungi Caratteristica
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Attivo
                </label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Salva
                </Button>
                <Button onClick={resetForm} variant="outline">
                  <X className="w-4 h-4 mr-2" />
                  Annulla
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Structure Types List */}
        <div className="grid gap-6">
          {structureTypes.map((structureType) => (
            <Card key={structureType.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-xl font-bold text-green-800">{structureType.name}</h3>
                      <Badge className={structureType.is_active ? "bg-green-500" : "bg-gray-500"}>
                        {structureType.is_active ? "Attivo" : "Inattivo"}
                      </Badge>
                      <Badge variant="outline">
                        {structureType.structure_category} - {structureType.material_type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-700 mb-4">{structureType.description}</p>
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-800">Caratteristiche:</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {structureType.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {structureType.image && (
                        <div>
                          <img
                            src={structureType.image || "/placeholder.svg"}
                            alt={structureType.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button onClick={() => startEdit(structureType)} variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(structureType.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
