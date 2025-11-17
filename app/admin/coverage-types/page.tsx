"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ModernAdminWrapper } from "@/components/admin/modern-admin-wrapper"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Save, X } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"

interface CoverageType {
  id: string
  name: string
  description: string
  image: string
  price_modifier: number
  created_at: string
  updated_at: string
}

interface StructureType {
  id: string
  name: string
  description: string
}

interface CoverageStructureLink {
  coverage_type_id: string
  structure_type_id: string
}

export default function CoverageTypesPage() {
  const [coverageTypes, setCoverageTypes] = useState<CoverageType[]>([])
  const [structureTypes, setStructureTypes] = useState<StructureType[]>([])
  const [coverageStructureLinks, setCoverageStructureLinks] = useState<CoverageStructureLink[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price_modifier: 0,
  })

  useEffect(() => {
    fetchCoverageTypes()
    fetchStructureTypes()
    fetchCoverageStructureLinks()
  }, [])

  const fetchCoverageTypes = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("carport_coverage_types")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching coverage types:", error)
    } else {
      setCoverageTypes(data || [])
    }
    setLoading(false)
  }

  const fetchStructureTypes = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("carport_structure_types")
      .select("id, name, description")
      .eq("is_active", true)
      .order("name")

    if (error) {
      console.error("Error fetching structure types:", error)
    } else {
      setStructureTypes(data || [])
    }
  }

  const fetchCoverageStructureLinks = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("carport_coverage_structure_types")
      .select("coverage_type_id, structure_type_id")

    if (error) {
      console.error("Error fetching coverage-structure links:", error)
    } else {
      setCoverageStructureLinks(data || [])
    }
  }

  const toggleStructureTypeLink = async (coverageTypeId: string, structureTypeId: string) => {
    const supabase = createClient()
    const existingLink = coverageStructureLinks.find(
      (link) => link.coverage_type_id === coverageTypeId && link.structure_type_id === structureTypeId,
    )

    if (existingLink) {
      const { error } = await supabase
        .from("carport_coverage_structure_types")
        .delete()
        .eq("coverage_type_id", coverageTypeId)
        .eq("structure_type_id", structureTypeId)

      if (error) {
        console.error("Error removing link:", error)
      } else {
        await fetchCoverageStructureLinks()
      }
    } else {
      const { error } = await supabase
        .from("carport_coverage_structure_types")
        .insert([{ coverage_type_id: coverageTypeId, structure_type_id: structureTypeId }])

      if (error) {
        console.error("Error adding link:", error)
      } else {
        await fetchCoverageStructureLinks()
      }
    }
  }

  const isLinkedToStructureType = (coverageTypeId: string, structureTypeId: string) => {
    return coverageStructureLinks.some(
      (link) => link.coverage_type_id === coverageTypeId && link.structure_type_id === structureTypeId,
    )
  }

  const getLinkedStructureTypes = (coverageTypeId: string) => {
    const linkedIds = coverageStructureLinks
      .filter((link) => link.coverage_type_id === coverageTypeId)
      .map((link) => link.structure_type_id)

    return structureTypes.filter((st) => linkedIds.includes(st.id))
  }

  const handleSave = async () => {
    const supabase = createClient()
    const dataToSave = {
      ...formData,
      price_modifier: Number(formData.price_modifier),
    }

    let error
    if (editingId) {
      const { error: updateError } = await supabase
        .from("carport_coverage_types")
        .update(dataToSave)
        .eq("id", editingId)
      error = updateError
    } else {
      const { error: insertError } = await supabase.from("carport_coverage_types").insert([dataToSave])
      error = insertError
    }

    if (error) {
      console.error("Error saving coverage type:", error)
    } else {
      await fetchCoverageTypes()
      resetForm()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo tipo di copertura?")) return

    const supabase = createClient()
    const { error } = await supabase.from("carport_coverage_types").delete().eq("id", id)

    if (error) {
      console.error("Error deleting coverage type:", error)
    } else {
      await fetchCoverageTypes()
    }
  }

  const startEdit = (coverageType: CoverageType) => {
    setEditingId(coverageType.id)
    setFormData({
      name: coverageType.name,
      description: coverageType.description,
      image: coverageType.image,
      price_modifier: coverageType.price_modifier,
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
      price_modifier: 0,
    })
  }

  if (loading) {
    return (
      <ModernAdminWrapper title="Tipi Copertura">
        <div className="text-center py-8 text-green-600">Caricamento tipi di copertura...</div>
      </ModernAdminWrapper>
    )
  }

  return (
    <ModernAdminWrapper title="Tipi Copertura">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-800">Gestione Tipi di Copertura</h1>
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
                {editingId ? "Modifica Tipo di Copertura" : "Nuovo Tipo di Copertura"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="es. Tegole Canadesi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modificatore Prezzo (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price_modifier}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, price_modifier: Number.parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="es. 15.5"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  currentImage={formData.image}
                  onImageUploaded={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  folder="coverage-types"
                  label="Immagine Tipo Copertura"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrizione del tipo di copertura..."
                  rows={3}
                />
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

        {/* Coverage Types List */}
        <div className="grid gap-6">
          {coverageTypes.map((coverageType) => (
            <Card key={coverageType.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <h3 className="text-xl font-bold text-green-800">{coverageType.name}</h3>
                      <span className="text-sm text-gray-600">
                        Modificatore prezzo: {coverageType.price_modifier > 0 ? "+" : ""}
                        {coverageType.price_modifier}%
                      </span>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Tipi di Struttura Collegati ({getLinkedStructureTypes(coverageType.id).length}/
                        {structureTypes.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {structureTypes.map((structureType) => {
                          const isLinked = isLinkedToStructureType(coverageType.id, structureType.id)
                          return (
                            <Button
                              key={structureType.id}
                              onClick={() => toggleStructureTypeLink(coverageType.id, structureType.id)}
                              variant={isLinked ? "default" : "outline"}
                              size="sm"
                              className={
                                isLinked
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "border-green-300 text-green-700 hover:bg-green-50"
                              }
                            >
                              {structureType.name}
                            </Button>
                          )
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Clicca sui pulsanti per collegare/scollegare questo tipo di copertura ai tipi di struttura
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-700">{coverageType.description}</p>
                      </div>

                      {coverageType.image && (
                        <div>
                          <img
                            src={coverageType.image || "/placeholder.svg"}
                            alt={coverageType.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button onClick={() => startEdit(coverageType)} variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(coverageType.id)}
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
    </ModernAdminWrapper>
  )
}
