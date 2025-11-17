"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ModernAdminWrapper } from "@/components/admin/modern-admin-wrapper"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon } from "lucide-react"
import { ImageUploadDragDrop } from "@/components/admin/ImageUploadDragDrop"
import { useAdminConfigurator } from "@/contexts/AdminConfiguratorContext"

interface StructureType {
  id: string
  name: string
  description: string | null
  image: string | null
  image_url?: string | null
  base_price?: string | number
  structure_category?: string
  is_active?: boolean
  attivo?: boolean
  display_order?: number
  ordine?: number
  created_at: string
  updated_at: string
}

export default function StructureTypesPage() {
  const { configuratorType, configuratorTypeUpper } = useAdminConfigurator()
  const [structureTypes, setStructureTypes] = useState<StructureType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    base_price: 0,
    is_active: true,
    display_order: 0,
  })

  useEffect(() => {
    fetchStructureTypes()
  }, [configuratorType])

  const fetchStructureTypes = async () => {
    setLoading(true)
    const supabase = createClient()
    
    // Determina la tabella corretta
    const tableName = configuratorType === 'legno' 
      ? 'carport_legno_structure_types' 
      : 'carport_structure_types'
    
    console.log(`[Admin] Fetching from ${tableName} for ${configuratorType}`)
    
    let query = supabase
      .from(tableName)
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false })
    
    // Per ferro, filtra per structure_category
    if (configuratorType === 'ferro') {
      query = query.eq('structure_category', 'FERRO')
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching structure types:", error)
    } else {
      console.log(`[Admin] Loaded ${data?.length || 0} structure types:`, data)
      setStructureTypes(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    const supabase = createClient()
    
    const tableName = configuratorType === 'legno' 
      ? 'carport_legno_structure_types' 
      : 'carport_structure_types'
    
    const dataToSave: any = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      base_price: formData.base_price,
      display_order: formData.display_order,
    }
    
    // Aggiungi campi specifici per tabella
    if (configuratorType === 'legno') {
      dataToSave.is_active = formData.is_active
    } else {
      dataToSave.attivo = formData.is_active
      dataToSave.structure_category = 'FERRO'
      dataToSave.compatibile_con = ['acciaio']
    }

    console.log("[Admin] Saving structure type:", dataToSave)

    let error
    if (editingId) {
      const { error: updateError } = await supabase
        .from(tableName)
        .update(dataToSave)
        .eq("id", editingId)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from(tableName)
        .insert([dataToSave])
      error = insertError
    }

    if (error) {
      console.error("Error saving structure type:", error)
      alert(`Errore nel salvataggio: ${error.message}`)
    } else {
      console.log("[Admin] Structure type saved successfully")
      await fetchStructureTypes()
      resetForm()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo tipo di struttura?")) return

    const supabase = createClient()
    const tableName = configuratorType === 'legno' 
      ? 'carport_legno_structure_types' 
      : 'carport_structure_types'
      
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting structure type:", error)
      alert(`Errore nell'eliminazione: ${error.message}`)
    } else {
      await fetchStructureTypes()
    }
  }

  const startEdit = (structureType: StructureType) => {
    setEditingId(structureType.id)
    setFormData({
      name: structureType.name,
      description: structureType.description || "",
      image: structureType.image || structureType.image_url || "",
      base_price: Number(structureType.base_price) || 0,
      is_active: structureType.is_active ?? structureType.attivo ?? true,
      display_order: structureType.display_order ?? structureType.ordine ?? 0,
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
      base_price: 0,
      is_active: true,
      display_order: 0,
    })
  }

  if (loading) {
    return (
      <ModernAdminWrapper title="Tipi Struttura">
        <div className="text-center py-8">Caricamento tipi di struttura...</div>
      </ModernAdminWrapper>
    )
  }

  return (
    <ModernAdminWrapper title="Tipi Struttura">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Gestione Tipi di Struttura</h1>
            <p className="text-sm text-gray-600 mt-1">
              Configuratore: <span className="font-semibold">{configuratorTypeUpper}</span>
            </p>
          </div>
          <Button 
            onClick={() => setIsCreating(true)} 
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuovo Tipo
          </Button>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || editingId) && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingId ? "Modifica Tipo di Struttura" : "Nuovo Tipo di Struttura"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="es. Addossato Legno"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Prezzo Base (€)</label>
                  <Input
                    type="number"
                    value={formData.base_price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, base_price: Number(e.target.value) }))}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descrizione</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrizione del tipo di struttura..."
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Immagine</label>
                <ImageUploadDragDrop
                  currentImage={formData.image}
                  onImageUploaded={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                  folder="structure-types"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Ordine di visualizzazione</label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, display_order: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData((prev) => ({ ...prev, is_active: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium">
                    Attivo
                  </label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {structureTypes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Nessun tipo di struttura trovato per {configuratorTypeUpper}</p>
              <p className="text-sm mt-2">Clicca su "Nuovo Tipo" per aggiungerne uno</p>
            </div>
          ) : (
            structureTypes.map((type) => (
              <Card key={type.id} className="overflow-hidden">
                <div className="aspect-video relative bg-gray-100">
                  {(type.image || type.image_url) ? (
                    <img
                      src={type.image || type.image_url || ''}
                      alt={type.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={type.is_active ?? type.attivo ? "default" : "secondary"}>
                      {type.is_active ?? type.attivo ? "Attivo" : "Disattivo"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-2">{type.name}</h3>
                  {type.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{type.description}</p>
                  )}
                  {type.base_price && (
                    <p className="text-sm font-semibold mb-3">
                      Prezzo base: €{Number(type.base_price).toFixed(2)}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => startEdit(type)}
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Modifica
                    </Button>
                    <Button
                      onClick={() => handleDelete(type.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ModernAdminWrapper>
  )
}
