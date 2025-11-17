"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModernAdminWrapper } from "@/components/admin/modern-admin-wrapper"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2 } from "lucide-react"

interface PricingRule {
  id: string
  rule_type: string
  condition_key: string
  condition_value: string
  modifier_type: string
  price_modifier: number
}

export default function PricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingRule, setEditingRule] = useState<Partial<PricingRule>>({})

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    const supabase = createClient()
    const { data, error } = await supabase.from("carport_pricing_rules").select("*").order("rule_type, condition_key")

    if (error) {
      console.error("Error fetching pricing rules:", error)
    } else {
      setRules(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    const supabase = createClient()

    if (editingRule.id) {
      // Update existing rule
      const { error } = await supabase
        .from("carport_pricing_rules")
        .update({
          rule_type: editingRule.rule_type,
          condition_key: editingRule.condition_key,
          condition_value: editingRule.condition_value,
          modifier_type: editingRule.modifier_type,
          price_modifier: editingRule.price_modifier,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingRule.id)

      if (error) {
        console.error("Error updating pricing rule:", error)
        return
      }
    } else {
      // Create new rule
      const { error } = await supabase.from("carport_pricing_rules").insert([
        {
          rule_type: editingRule.rule_type,
          condition_key: editingRule.condition_key,
          condition_value: editingRule.condition_value,
          modifier_type: editingRule.modifier_type,
          price_modifier: editingRule.price_modifier,
        },
      ])

      if (error) {
        console.error("Error creating pricing rule:", error)
        return
      }
    }

    setIsEditing(false)
    setEditingRule({})
    fetchRules()
  }

  const handleEdit = (rule: PricingRule) => {
    setEditingRule(rule)
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa regola di prezzo?")) return

    const supabase = createClient()
    const { error } = await supabase.from("carport_pricing_rules").delete().eq("id", id)

    if (error) {
      console.error("Error deleting pricing rule:", error)
    } else {
      fetchRules()
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingRule({})
  }

  if (loading) {
    return (
      <ModernAdminWrapper title="Prezzi">
        <div className="text-center py-8 text-green-600">Caricamento regole di prezzo...</div>
      </ModernAdminWrapper>
    )
  }

  return (
    <ModernAdminWrapper title="Prezzi">
      <div className="space-y-6">
        {/* Add/Edit Form */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle className="text-green-800">
                {editingRule.id ? "Modifica Regola di Prezzo" : "Nuova Regola di Prezzo"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule_type">Tipo Regola</Label>
                  <Select
                    value={editingRule.rule_type || ""}
                    onValueChange={(value) => setEditingRule({ ...editingRule, rule_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona tipo regola" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dimensioni">Dimensioni</SelectItem>
                      <SelectItem value="superficie">Superficie</SelectItem>
                      <SelectItem value="quantita">Quantità</SelectItem>
                      <SelectItem value="stagionale">Stagionale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="condition_key">Chiave Condizione</Label>
                  <Input
                    id="condition_key"
                    value={editingRule.condition_key || ""}
                    onChange={(e) => setEditingRule({ ...editingRule, condition_key: e.target.value })}
                    placeholder="es. larghezza, superficie_totale"
                  />
                </div>
                <div>
                  <Label htmlFor="condition_value">Valore Condizione</Label>
                  <Input
                    id="condition_value"
                    value={editingRule.condition_value || ""}
                    onChange={(e) => setEditingRule({ ...editingRule, condition_value: e.target.value })}
                    placeholder="es. >500, >=20"
                  />
                </div>
                <div>
                  <Label htmlFor="modifier_type">Tipo Modificatore</Label>
                  <Select
                    value={editingRule.modifier_type || ""}
                    onValueChange={(value) => setEditingRule({ ...editingRule, modifier_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona tipo modificatore" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fisso">Fisso (€)</SelectItem>
                      <SelectItem value="percentuale">Percentuale (%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price_modifier">Modificatore Prezzo</Label>
                  <Input
                    id="price_modifier"
                    type="number"
                    step="0.01"
                    value={editingRule.price_modifier || ""}
                    onChange={(e) => setEditingRule({ ...editingRule, price_modifier: Number(e.target.value) })}
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

        {/* Rules List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-800">Regole di Prezzo ({rules.length})</CardTitle>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nuova Regola
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-green-800">Tipo:</span>
                          <p className="text-green-600">{rule.rule_type}</p>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">Condizione:</span>
                          <p className="text-green-600">
                            {rule.condition_key} {rule.condition_value}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-green-800">Modificatore:</span>
                          <p className="text-green-600">
                            {rule.modifier_type === "percentuale"
                              ? `${rule.price_modifier}%`
                              : `€${rule.price_modifier}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(rule)} className="bg-transparent">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(rule.id)}
                        className="bg-transparent text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
