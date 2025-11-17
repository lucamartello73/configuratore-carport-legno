"use client"

import { useEffect, useState } from 'react'
import { ModernAdminWrapper } from '@/components/admin/modern-admin-wrapper'
import { ModernCard, ModernCardHeader, ModernCardContent, ModernCardTitle } from '@/components/admin/ui/ModernCard'
import { ModernInput } from '@/components/admin/ui/ModernInput'
import { ModernButton } from '@/components/admin/ui/ModernButton'
import { useConfigurator } from '@/contexts/ConfiguratorContext'
import { createClient } from '@/lib/supabase/client'
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react'
import { ModernModal } from '@/components/admin/ui/ModernModal'

interface Color {
  id: string
  name: string
  code?: string
  hex_color?: string
  price_modifier: number
  category: string
  image_url?: string
  configurator_type: 'FERRO' | 'LEGNO'
  created_at: string
}

export default function ColorsPageNew() {
  const { configuratorType } = useConfigurator()
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingColor, setEditingColor] = useState<Partial<Color> | null>(null)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  // Carica colori filtrati per configurator_type
  useEffect(() => {
    loadColors()
  }, [configuratorType])

  async function loadColors() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('carport_colors')
        .select('*')
        .eq('configurator_type', configuratorType)
        .order('category')
        .order('name')

      if (error) throw error
      setColors(data || [])
    } catch (error) {
      console.error('Errore caricamento colori:', error)
      alert('Errore nel caricamento dei colori')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!editingColor?.name || !editingColor?.category) {
      alert('Nome e categoria sono obbligatori')
      return
    }

    try {
      setSaving(true)
      
      const colorData = {
        name: editingColor.name,
        code: editingColor.code || null,
        hex_color: editingColor.hex_color || null,
        price_modifier: editingColor.price_modifier || 0,
        category: editingColor.category,
        image_url: editingColor.image_url || null,
        configurator_type: configuratorType
      }

      if (editingColor.id) {
        // Update
        const { error } = await supabase
          .from('carport_colors')
          .update(colorData)
          .eq('id', editingColor.id)

        if (error) throw error
      } else {
        // Insert
        const { error } = await supabase
          .from('carport_colors')
          .insert([colorData])

        if (error) throw error
      }

      await loadColors()
      setIsModalOpen(false)
      setEditingColor(null)
    } catch (error) {
      console.error('Errore salvataggio:', error)
      alert('Errore nel salvataggio del colore')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Sei sicuro di voler eliminare questo colore?')) return

    try {
      const { error } = await supabase
        .from('carport_colors')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadColors()
    } catch (error) {
      console.error('Errore eliminazione:', error)
      alert('Errore nell\'eliminazione del colore')
    }
  }

  function openModal(color?: Color) {
    setEditingColor(color || { configurator_type: configuratorType })
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <ModernAdminWrapper title="Colori">
        <div className="text-center py-12 text-gray-500">Caricamento...</div>
      </ModernAdminWrapper>
    )
  }

  return (
    <ModernAdminWrapper title="Colori">
      {/* Header con pulsante Aggiungi */}
      <div className="flex justify-between items-center mb-8">
        <p className="text-gray-600">
          Gestisci i colori per il configuratore <strong>{configuratorType}</strong>
        </p>
        <ModernButton
          onClick={() => openModal()}
          icon={<PlusIcon className="w-5 h-5" />}
        >
          Aggiungi Colore
        </ModernButton>
      </div>

      {/* Grid colori */}
      {colors.length === 0 ? (
        <ModernCard>
          <ModernCardContent className="py-12 text-center text-gray-500">
            Nessun colore trovato per {configuratorType}. Aggiungine uno!
          </ModernCardContent>
        </ModernCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {colors.map((color) => (
            <ModernCard key={color.id}>
              <ModernCardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <ModernCardTitle>{color.name}</ModernCardTitle>
                    <p className="text-sm text-gray-500 mt-1">{color.category}</p>
                    {color.code && (
                      <p className="text-xs text-gray-400 mt-1">Codice: {color.code}</p>
                    )}
                  </div>
                  {color.hex_color && (
                    <div
                      className="w-12 h-12 rounded-lg border-2 border-gray-200 shadow-sm"
                      style={{ backgroundColor: color.hex_color }}
                    />
                  )}
                </div>
              </ModernCardHeader>
              <ModernCardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {color.price_modifier > 0 && '+'}
                    {color.price_modifier}€
                  </span>
                  <div className="flex gap-2">
                    <ModernButton
                      size="sm"
                      variant="ghost"
                      icon={<EditIcon className="w-4 h-4" />}
                      onClick={() => openModal(color)}
                    >
                      Modifica
                    </ModernButton>
                    <ModernButton
                      size="sm"
                      variant="danger"
                      icon={<TrashIcon className="w-4 h-4" />}
                      onClick={() => handleDelete(color.id)}
                    >
                      Elimina
                    </ModernButton>
                  </div>
                </div>
              </ModernCardContent>
            </ModernCard>
          ))}
        </div>
      )}

      {/* Modal Modifica/Crea */}
      <ModernModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingColor?.id ? 'Modifica Colore' : 'Nuovo Colore'}
        size="md"
      >
        <div className="space-y-4">
                <ModernInput
                  label="Nome"
                  value={editingColor?.name || ''}
                  onChange={(e) => setEditingColor({ ...editingColor, name: e.target.value })}
                  required
                />

                <ModernInput
                  label="Categoria"
                  value={editingColor?.category || ''}
                  onChange={(e) => setEditingColor({ ...editingColor, category: e.target.value })}
                  required
                  placeholder="es. Struttura, Copertura"
                />

                <div className="grid grid-cols-2 gap-4">
                  <ModernInput
                    label="Codice (RAL/altro)"
                    value={editingColor?.code || ''}
                    onChange={(e) => setEditingColor({ ...editingColor, code: e.target.value })}
                    placeholder="es. RAL 9005"
                  />

                  <ModernInput
                    label="Colore Esadecimale"
                    type="text"
                    value={editingColor?.hex_color || ''}
                    onChange={(e) => setEditingColor({ ...editingColor, hex_color: e.target.value })}
                    placeholder="#000000"
                  />
                </div>

                <ModernInput
                  label="Supplemento Prezzo (€)"
                  type="number"
                  step="0.01"
                  value={editingColor?.price_modifier || 0}
                  onChange={(e) => setEditingColor({ ...editingColor, price_modifier: parseFloat(e.target.value) })}
                />

                <ModernInput
                  label="URL Immagine (opzionale)"
                  value={editingColor?.image_url || ''}
                  onChange={(e) => setEditingColor({ ...editingColor, image_url: e.target.value })}
                  placeholder="https://..."
                />

                <div className="flex gap-3 pt-4">
                  <ModernButton
                    onClick={handleSave}
                    loading={saving}
                    className="flex-1"
                  >
                    Salva
                  </ModernButton>
                  <ModernButton
                    variant="secondary"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Annulla
                  </ModernButton>
                </div>
              </div>
      </ModernModal>
    </ModernAdminWrapper>
  )
}
