"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ModernAdminWrapper } from "@/components/admin/modern-admin-wrapper"
import { PlusIcon, EditIcon, TrashIcon } from "@/components/ui/simple-icons"
import { createClient } from "@/lib/supabase/client"

interface Color {
  id: string
  name: string
  hex_value: string
  price_modifier: number
  category: string
  macro_category?: string
  is_custom_choice?: boolean
  display_order?: number
  created_at: string
  updated_at: string
}

interface Model {
  id: string
  name: string
  description: string
}

interface MacroCategoryConfig {
  key: string
  label: string
  linkedModelId: string | null // Changed from linkedStructureType to linkedModelId
}

const MACRO_CATEGORIES = [
  { key: "COLORI_RAL", label: "COLORI RAL 5+1", linkedModelId: null }, // Changed property name
  { key: "IMPREGNANTI_LEGNO", label: "IMPREGNANTI LEGNO 5+1", linkedModelId: null },
  { key: "IMPREGNANTI_PASTELLO", label: "IMPREGNANTI PASTELLO 5+1", linkedModelId: null },
] as MacroCategoryConfig[]

export default function ColorsPage() {
  const [colors, setColors] = useState<Color[]>([])
  const [models, setModels] = useState<Model[]>([]) // Changed from structureTypes to models
  const [macroCategoryConfigs, setMacroCategoryConfigs] = useState<MacroCategoryConfig[]>(MACRO_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingColor, setEditingColor] = useState<Partial<Color>>({})

  useEffect(() => {
    fetchColors()
    fetchModels() // Changed from fetchStructureTypes to fetchModels
  }, [])

  const fetchColors = async () => {
    try {
      console.log("[v0] Fetching colors from database")
      const supabase = createClient()

      const { data, error } = await supabase.from("carport_colors").select("*").order("category").order("name")

      if (error) {
        console.error("[v0] Error fetching colors:", error)
        throw error
      }

      console.log("[v0] Colors fetched successfully:", data)

      const transformedColors = (data || []).map((color) => ({
        ...color,
        macro_category:
          color.category === "smalti_ral"
            ? "COLORI_RAL"
            : color.category === "impregnanti_legno"
              ? "IMPREGNANTI_LEGNO"
              : color.category === "impregnanti_pastello"
                ? "IMPREGNANTI_PASTELLO"
                : color.category === "structure"
                  ? "COLORI_RAL"
                  : color.category === "coverage"
                    ? "IMPREGNANTI_LEGNO"
                    : "COLORI_RAL", // fallback
        is_custom_choice: color.name.toLowerCase().includes("scelta cliente") || false,
        display_order: 0,
      }))

      setColors(transformedColors)
    } catch (error) {
      console.error("Error fetching colors:", error)
    }
    setLoading(false)
  }

  const fetchModels = async () => {
    // Changed function name and implementation
    try {
      console.log("[v0] Fetching models from database")
      const supabase = createClient()
      const { data, error } = await supabase.from("carport_models").select("id, name, description").order("name")

      if (error) {
        console.error("[v0] Error fetching models:", error)
        throw error
      }

      console.log("[v0] Models fetched successfully:", data)
      setModels(data || [])
    } catch (error) {
      console.error("Error fetching models:", error)
    }
  }

  const handleSave = async () => {
    try {
      const supabase = createClient()

      const dbCategory =
        editingColor.macro_category === "COLORI_RAL"
          ? "smalti_ral"
          : editingColor.macro_category === "IMPREGNANTI_LEGNO"
            ? "impregnanti_legno"
            : editingColor.macro_category === "IMPREGNANTI_PASTELLO"
              ? "impregnanti_pastello"
              : "smalti_ral" // fallback

      if (editingColor.id) {
        console.log("[v0] Updating color:", editingColor.id)
        const { error } = await supabase
          .from("carport_colors")
          .update({
            name: editingColor.name!,
            hex_value: editingColor.hex_value!,
            price_modifier: editingColor.price_modifier!,
            category: dbCategory,
          })
          .eq("id", editingColor.id)

        if (error) throw error
      } else {
        console.log("[v0] Creating new color:", editingColor)
        const { error } = await supabase.from("carport_colors").insert([
          {
            name: editingColor.name!,
            hex_value: editingColor.hex_value!,
            price_modifier: editingColor.price_modifier!,
            category: dbCategory,
          },
        ])

        if (error) throw error
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
    if (!confirm("Sei sicuro di voler eliminare questo colore?")) return

    try {
      console.log("[v0] Deleting color:", id)
      const supabase = createClient()
      const { error } = await supabase.from("carport_colors").delete().eq("id", id)

      if (error) throw error

      fetchColors()
    } catch (error) {
      console.error("Error deleting color:", error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingColor({})
  }

  const updateMacroCategoryLink = (macroCategoryKey: string, modelId: string | null) => {
    // Changed parameter name
    console.log(`[v0] Linking macro category ${macroCategoryKey} to model ${modelId}`)
    setMacroCategoryConfigs((prev) =>
      prev.map(
        (config) => (config.key === macroCategoryKey ? { ...config, linkedModelId: modelId } : config), // Changed property name
      ),
    )
  }

  const getMacroCategoryLabel = (macroCategory: string) => {
    switch (macroCategory) {
      case "COLORI_RAL":
        return "COLORI RAL 5+1"
      case "IMPREGNANTI_LEGNO":
        return "IMPREGNANTI LEGNO 5+1"
      case "IMPREGNANTI_PASTELLO":
        return "IMPREGNANTI PASTELLO 5+1"
      default:
        return macroCategory || "Senza Categoria"
    }
  }

  const groupedColors = colors.reduce(
    (acc, color) => {
      const macroCategory = color.macro_category || "COLORI_RAL"
      if (!acc[macroCategory]) acc[macroCategory] = []
      acc[macroCategory].push(color)
      return acc
    },
    {} as Record<string, Color[]>,
  )

  if (loading) {
    return (
      <ModernAdminWrapper title="Colori">
        <div className="text-center py-8 text-green-600">Caricamento colori...</div>
      </ModernAdminWrapper>
    )
  }

  return (
    <ModernAdminWrapper title="Colori">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-800">Configurazione Macrocategorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {macroCategoryConfigs.map((config) => (
                <div key={config.key} className="border rounded-lg p-4 bg-green-50">
                  <h4 className="font-semibold text-green-800 mb-2">{config.label}</h4>
                  <Label htmlFor={`link-${config.key}`}>Collegato al Modello:</Label> {/* Changed label text */}
                  <Select
                    value={config.linkedModelId || "none"} // Changed property name
                    onValueChange={(value) => updateMacroCategoryLink(config.key, value === "none" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona modello" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nessun collegamento</SelectItem>
                      {models.map(
                        (
                          model, // Changed from structureTypes to models
                        ) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-green-600 mt-1">Colori: {groupedColors[config.key]?.length || 0}/6</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
                  <Label htmlFor="hex_value">Codice Colore (Hex)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="hex_value"
                      value={editingColor.hex_value || ""}
                      onChange={(e) => setEditingColor({ ...editingColor, hex_value: e.target.value })}
                      placeholder="#000000"
                    />
                    <div
                      className="w-12 h-10 rounded border"
                      style={{ backgroundColor: editingColor.hex_value || "#ffffff" }}
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
                <div>
                  <Label htmlFor="display_order">Ordine Visualizzazione</Label>
                  <Input
                    id="display_order"
                    type="number"
                    value={editingColor.display_order || ""}
                    onChange={(e) => setEditingColor({ ...editingColor, display_order: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="macro_category">Macrocategoria</Label>
                  <Select
                    value={editingColor.macro_category || "COLORI_RAL"}
                    onValueChange={(value) => setEditingColor({ ...editingColor, macro_category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona macrocategoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COLORI_RAL">COLORI RAL 5+1</SelectItem>
                      <SelectItem value="IMPREGNANTI_LEGNO">IMPREGNANTI LEGNO 5+1</SelectItem>
                      <SelectItem value="IMPREGNANTI_PASTELLO">IMPREGNANTI PASTELLO 5+1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_custom_choice"
                  checked={editingColor.is_custom_choice || false}
                  onCheckedChange={(checked) =>
                    setEditingColor({ ...editingColor, is_custom_choice: checked as boolean })
                  }
                />
                <Label htmlFor="is_custom_choice">Opzione "Scelta Cliente"</Label>
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
              <CardTitle className="text-green-800">Gestione Colori per Macrocategorie ({colors.length})</CardTitle>
              <Button
                onClick={() => {
                  setEditingColor({ category: "smalti_ral", macro_category: "COLORI_RAL", display_order: 1 })
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
            {Object.entries(groupedColors).map(([macroCategory, categoryColors]) => (
              <div key={macroCategory} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-800 border-b pb-2">
                    {getMacroCategoryLabel(macroCategory)} ({categoryColors.length}/6)
                  </h3>
                  <div className="text-sm text-green-600">
                    Collegato a:{" "}
                    {macroCategoryConfigs.find((c) => c.key === macroCategory)?.linkedModelId // Changed property name
                      ? models.find(
                          // Changed from structureTypes to models
                          (model) =>
                            model.id === macroCategoryConfigs.find((c) => c.key === macroCategory)?.linkedModelId, // Changed property name
                        )?.name || "Non trovato"
                      : "Nessun collegamento"}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categoryColors.map((color) => (
                    <div key={color.id} className="border rounded-lg p-4 bg-green-50">
                      <div
                        className="w-full h-16 rounded-lg mb-2 border"
                        style={{ backgroundColor: color.hex_value }}
                      />
                      <h4 className="font-semibold text-green-800 text-sm mb-1">{color.name}</h4>
                      <p className="text-xs text-green-600 mb-1">
                        {color.price_modifier > 0 ? `+€${color.price_modifier}` : "Incluso"}
                      </p>
                      {color.is_custom_choice && <p className="text-xs text-orange-600 mb-1">Scelta Cliente</p>}
                      <p className="text-xs text-gray-500 mb-2">Ordine: {color.display_order}</p>
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
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </ModernAdminWrapper>
  )
}
