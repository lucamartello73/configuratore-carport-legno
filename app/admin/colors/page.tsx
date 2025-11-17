"use client"

import { useEffect, useState } from 'react'
import { ModernAdminWrapper } from '@/components/admin/modern-admin-wrapper'
import { 
  ModernCard, 
  ModernCardHeader, 
  ModernCardContent, 
  ModernCardTitle 
} from '@/components/admin/ui/ModernCard'
import { ModernInput } from '@/components/admin/ui/ModernInput'
import { ModernSelect } from '@/components/admin/ui/ModernSelect'
import { ModernButton } from '@/components/admin/ui/ModernButton'
import { ModernModal } from '@/components/admin/ui/ModernModal'
import { ImageUploadDragDrop } from '@/components/admin/ui/ImageUploadDragDrop'
import { useConfigurator } from '@/contexts/ConfiguratorContext'
import { createClient } from '@/lib/supabase/client'
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react'

interface Color {
  id: string
  name: string
  code?: string
  hex_color?: string
  price_modifier: number
  category: string
  image_url?: string
  configurator_type: 'FERRO' | 'LEGNO'
  order_index?: number
  created_at: string
}

interface Model {
  id: string
  name: string
}

export default function ColorsPage() {
  const { configuratorType } = useConfigurator()
  const [colors, setColors] = useState<Color[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingColor, setEditingColor] = useState<Partial<Color> | null>(null)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  // Carica colori e modelli
  useEffect(() => {
    loadColors()
    loadModels()
  }, [configuratorType])

  async function loadColors() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('carport_colors')
        .select('*')
        .eq('configurator_type', configuratorType)
        .order('category')
        .order('order_index', { nullsFirst: false })
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

  async function loadModels() {
    try {
      const tableName = configuratorType === 'FERRO' ? 'carport_models' : 'carport_legno_models'
      const { data, error } = await supabase
        .from(tableName)
        .select('id, name')
        .order('name')

      if (error) throw error
      setModels(data || [])
    } catch (error) {
      console.error('Errore caricamento modelli:', error)
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
        order_index: editingColor.order_index || 0,
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
    setEditingColor(color || { 
      configurator_type: configuratorType,
      price_modifier: 0,
      order_index: 0
    })
    setIsModalOpen(true)
  }

  return (
    <ModernAdminWrapper title="Gestione Colori">
      <main className="space-y-8">
        {/* Header Info */}
        <ModernCard>
          <ModernCardHeader>
            <div className="flex items-center justify-between">
              <div>
                <ModernCardTitle>Colori Configuratore</ModernCardTitle>
                <p className="text-sm text-gray-600 mt-2">
                  Gestisci i colori disponibili per il configuratore{' '}
                  <span className={`font-semibold ${
                    configuratorType === 'FERRO' ? 'text-[#525252]' : 'text-[#5A3A1A]'
                  }`}>
                    {configuratorType}
                  </span>
                </p>
              </div>
              <ModernButton
                onClick={() => openModal()}
                icon={<PlusIcon className="w-5 h-5" />}
              >
                Nuovo Colore
              </ModernButton>
            </div>
          </ModernCardHeader>
        </ModernCard>

        {/* Loading State */}
        {loading ? (
          <ModernCard>
            <ModernCardContent className="py-12 text-center text-gray-500">
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Caricamento colori...</span>
              </div>
            </ModernCardContent>
          </ModernCard>
        ) : colors.length === 0 ? (
          /* Empty State */
          <ModernCard>
            <ModernCardContent className="py-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">
                    Nessun colore trovato per {configuratorType}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Inizia creando il primo colore
                  </p>
                </div>
                <ModernButton onClick={() => openModal()}>
                  Crea Primo Colore
                </ModernButton>
              </div>
            </ModernCardContent>
          </ModernCard>
        ) : (
          /* Grid Colori */
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {colors.map((color) => (
                <ModernCard key={color.id}>
                  <ModernCardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <ModernCardTitle className="truncate">{color.name}</ModernCardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            color.configurator_type === 'FERRO' 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {color.configurator_type}
                          </span>
                          <span className="text-xs text-gray-500">{color.category}</span>
                        </div>
                        {color.code && (
                          <p className="text-xs text-gray-400 mt-1">Codice: {color.code}</p>
                        )}
                      </div>
                      {color.hex_color && (
                        <div
                          className="w-14 h-14 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: color.hex_color }}
                          title={color.hex_color}
                        />
                      )}
                    </div>
                  </ModernCardHeader>
                  <ModernCardContent>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-sm font-semibold text-gray-900">
                          {color.price_modifier > 0 && '+'}
                          {color.price_modifier}€
                        </span>
                        {color.order_index !== undefined && (
                          <span className="text-xs text-gray-400 ml-2">
                            Ordine: {color.order_index}
                          </span>
                        )}
                      </div>
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
          </section>
        )}

        {/* Modal Crea/Modifica */}
        <ModernModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingColor(null)
          }}
          title={editingColor?.id ? 'Modifica Colore' : 'Nuovo Colore'}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernInput
                label="Nome Colore"
                value={editingColor?.name || ''}
                onChange={(e) => setEditingColor({ ...editingColor, name: e.target.value })}
                required
                placeholder="es. Nero Opaco"
              />

              <ModernInput
                label="Codice (RAL/altro)"
                value={editingColor?.code || ''}
                onChange={(e) => setEditingColor({ ...editingColor, code: e.target.value })}
                placeholder="es. RAL 9005"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernInput
                label="Categoria"
                value={editingColor?.category || ''}
                onChange={(e) => setEditingColor({ ...editingColor, category: e.target.value })}
                required
                placeholder="es. Struttura, Copertura"
              />

              <ModernInput
                label="Colore Esadecimale"
                type="text"
                value={editingColor?.hex_color || ''}
                onChange={(e) => setEditingColor({ ...editingColor, hex_color: e.target.value })}
                placeholder="#000000"
                helperText="Formato: #RRGGBB"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernInput
                label="Supplemento Prezzo (€)"
                type="number"
                step="0.01"
                value={editingColor?.price_modifier || 0}
                onChange={(e) => setEditingColor({ ...editingColor, price_modifier: parseFloat(e.target.value) || 0 })}
                helperText="Aggiunta o riduzione sul prezzo base"
              />

              <ModernInput
                label="Ordine Visualizzazione"
                type="number"
                value={editingColor?.order_index || 0}
                onChange={(e) => setEditingColor({ ...editingColor, order_index: parseInt(e.target.value) || 0 })}
                helperText="Ordine di visualizzazione (0 = primo)"
              />
            </div>

            <ImageUploadDragDrop
              label="Immagine Campione Colore"
              value={editingColor?.image_url || ''}
              onChange={(url) => setEditingColor({ ...editingColor, image_url: url })}
              helperText="Carica un'immagine del colore o inserisci un URL"
            />

            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <ModernButton
                onClick={handleSave}
                loading={saving}
                className="flex-1"
              >
                {editingColor?.id ? 'Salva Modifiche' : 'Crea Colore'}
              </ModernButton>
              <ModernButton
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingColor(null)
                }}
                className="flex-1"
                disabled={saving}
              >
                Annulla
              </ModernButton>
            </div>
          </div>
        </ModernModal>
      </main>
    </ModernAdminWrapper>
  )
}
