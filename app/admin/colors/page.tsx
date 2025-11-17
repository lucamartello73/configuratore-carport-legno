"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConfigurator } from '@/contexts/ConfiguratorContext'
import { createClient } from '@/lib/supabase/client'
import { getAdminSession } from '@/lib/auth/admin-auth'
import { PlusIcon, Edit2Icon, Trash2Icon } from 'lucide-react'
import { ModernCard } from '@/components/admin/ui/ModernCard'
import { ModernButton } from '@/components/admin/ui/ModernButton'
import { ModernInput } from '@/components/admin/ui/ModernInput'
import { ModernSelect } from '@/components/admin/ui/ModernSelect'
import { ModernModal } from '@/components/admin/ui/ModernModal'
import { ImageUploadDragDrop } from '@/components/admin/ui/ImageUploadDragDrop'

interface Color {
  id: string
  name: string
  code?: string
  hex_color?: string
  price_modifier: number
  category: string
  image_url?: string
  configurator_type: 'FERRO' | 'LEGNO'
  order_index: number
  created_at: string
}

// Mock colors for demo
const DEMO_COLORS: Omit<Color, 'id' | 'created_at' | 'configurator_type'>[] = [
  { name: 'Nero Opaco', code: 'RAL 9005', category: 'Struttura', hex_color: '#000000', price_modifier: 0, order_index: 1 },
  { name: 'Grigio Antracite', code: 'RAL 7016', category: 'Struttura', hex_color: '#1C1F24', price_modifier: 20, order_index: 2 },
  { name: 'Bianco Puro', code: 'RAL 9010', category: 'Struttura', hex_color: '#FFFFFF', price_modifier: 0, order_index: 3 },
  { name: 'Marrone Cioccolato', code: 'RAL 8017', category: 'Struttura', hex_color: '#3E2723', price_modifier: 30, order_index: 4 },
  { name: 'Legno Naturale', code: '–', category: 'Copertura', hex_color: '#C49A6C', price_modifier: 50, order_index: 5 },
  { name: 'Verde Muschio', code: 'RAL 6005', category: 'Copertura', hex_color: '#114232', price_modifier: 40, order_index: 6 },
]

export default function ColorsPage() {
  // Auth and routing
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [session, setSession] = useState<any>(null)
  
  // Data state
  const { configuratorType } = useConfigurator()
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  
  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingColor, setEditingColor] = useState<Partial<Color> | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  
  const supabase = createClient()

  // Handle SSR - mount check
  useEffect(() => {
    setMounted(true)
    const adminSession = getAdminSession()
    
    if (!adminSession) {
      router.push('/admin/login')
      return
    }
    
    setSession(adminSession)
  }, [router])

  // Fetch colors
  useEffect(() => {
    if (session) {
      fetchColors()
    }
  }, [configuratorType, session])

  async function fetchColors() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('carport_colors')
        .select('*')
        .eq('configurator_type', configuratorType)
        .order('order_index')
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

  async function handleCreateDemo() {
    try {
      setIsSaving(true)
      const demoColors = DEMO_COLORS.map(color => ({
        ...color,
        configurator_type: configuratorType
      }))

      const { error } = await supabase
        .from('carport_colors')
        .insert(demoColors)

      if (error) throw error
      
      await fetchColors()
      alert(`${DEMO_COLORS.length} colori demo creati per ${configuratorType}`)
    } catch (error) {
      console.error('Errore creazione demo:', error)
      alert('Errore nella creazione dei colori demo')
    } finally {
      setIsSaving(false)
    }
  }

  async function uploadImage(file: File): Promise<string> {
    try {
      setIsUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${configuratorType.toLowerCase()}-color-${Date.now()}.${fileExt}`
      const filePath = `colors/${fileName}`

      const { error: uploadError, data } = await supabase.storage
        .from('configurator-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('configurator-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Errore upload immagine:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  async function handleImageChange(value: string) {
    // If it's a data URL or blob, convert to file and upload
    if (value.startsWith('data:image') || value.startsWith('blob:')) {
      try {
        const response = await fetch(value)
        const blob = await response.blob()
        const file = new File([blob], 'color-image.jpg', { type: blob.type })
        const url = await uploadImage(file)
        setEditingColor({ ...editingColor, image_url: url })
      } catch (error) {
        console.error('Errore conversione immagine:', error)
        alert('Errore nel caricamento dell\'immagine')
      }
    } else {
      setEditingColor({ ...editingColor, image_url: value })
    }
  }

  async function handleSave() {
    if (!editingColor?.name || !editingColor?.category) {
      alert('Nome e categoria sono obbligatori')
      return
    }

    try {
      setIsSaving(true)
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
        const { error } = await supabase
          .from('carport_colors')
          .update(colorData)
          .eq('id', editingColor.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('carport_colors')
          .insert([colorData])
        
        if (error) throw error
      }

      await fetchColors()
      setIsModalOpen(false)
      setEditingColor(null)
    } catch (error) {
      console.error('Errore salvataggio:', error)
      alert('Errore nel salvataggio del colore')
    } finally {
      setIsSaving(false)
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
      await fetchColors()
    } catch (error) {
      console.error('Errore eliminazione:', error)
      alert('Errore nell\'eliminazione del colore')
    }
  }

  function handleEdit(color?: Color) {
    setEditingColor(color || {
      configurator_type: configuratorType,
      price_modifier: 0,
      order_index: colors.length + 1,
      category: 'Struttura'
    })
    setIsModalOpen(true)
  }

  // SSR fallback
  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F5F1E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6B7280' }}>Caricamento...</div>
      </div>
    )
  }

  // Not authenticated
  if (!session) {
    return null
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F1E8', padding: '24px' }}>
      {/* Header Card */}
      <ModernCard className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestione Colori</h1>
            <p className="text-gray-600 mt-2">
              Configuratore: <span className={`font-semibold ${configuratorType === 'FERRO' ? 'text-[#525252]' : 'text-[#5A3A1A]'}`}>
                {configuratorType}
              </span>
            </p>
          </div>
          <ModernButton
            onClick={() => handleEdit()}
            icon={<PlusIcon className="w-5 h-5" />}
            size="lg"
          >
            Nuovo Colore
          </ModernButton>
        </div>
      </ModernCard>

      {/* Loading State */}
      {loading && (
        <ModernCard>
          <div className="py-16 text-center">
            <div className="inline-flex items-center gap-3 text-gray-600">
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Caricamento colori...</span>
            </div>
          </div>
        </ModernCard>
      )}

      {/* Empty State */}
      {!loading && colors.length === 0 && (
        <ModernCard>
          <div className="py-16 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nessun colore disponibile</h3>
            <p className="text-gray-600 mb-6">Inizia creando colori manualmente o carica i colori demo</p>
            <div className="flex items-center justify-center gap-3">
              <ModernButton onClick={() => handleEdit()}>
                Crea Nuovo Colore
              </ModernButton>
              <ModernButton
                variant="secondary"
                onClick={handleCreateDemo}
                loading={isSaving}
              >
                Carica Colori Demo
              </ModernButton>
            </div>
          </div>
        </ModernCard>
      )}

      {/* Colors Grid */}
      {!loading && colors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {colors.map((color) => (
            <ModernCard key={color.id} className="hover:shadow-lg transition-shadow">
              <div className="p-0">
                {/* Image/Color Preview */}
                <div className="relative h-48 rounded-t-xl overflow-hidden bg-gray-50">
                  {color.image_url ? (
                    <img
                      src={color.image_url}
                      alt={color.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        if (e.currentTarget.nextElementSibling) {
                          (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full ${color.image_url ? 'hidden' : 'flex'} items-center justify-center text-white text-4xl font-bold`}
                    style={{ backgroundColor: color.hex_color || '#CCCCCC' }}
                  >
                    {!color.image_url && color.hex_color && (
                      <span className="text-sm bg-black bg-opacity-50 px-3 py-1 rounded">
                        {color.hex_color}
                      </span>
                    )}
                  </div>
                  
                  {/* Badge Configurator Type */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-lg ${
                      color.configurator_type === 'FERRO' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-amber-700 text-white'
                    }`}>
                      {color.configurator_type}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{color.name}</h3>
                    {color.code && <p className="text-sm text-gray-500">{color.code}</p>}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{color.category}</span>
                    <span className="font-semibold text-gray-900">
                      {color.price_modifier > 0 ? '+' : ''}{color.price_modifier}€
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">Ordine: {color.order_index}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(color)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Modifica"
                      >
                        <Edit2Icon className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(color.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Elimina"
                      >
                        <Trash2Icon className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
      )}

      {/* Edit/Create Modal */}
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
          <div className="grid grid-cols-2 gap-4">
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

          <div className="grid grid-cols-2 gap-4">
            <ModernSelect
              label="Categoria"
              value={editingColor?.category || 'Struttura'}
              onChange={(e) => setEditingColor({ ...editingColor, category: e.target.value })}
              required
              options={[
                { value: 'Struttura', label: 'Struttura' },
                { value: 'Copertura', label: 'Copertura' },
                { value: 'Altro', label: 'Altro' }
              ]}
            />
            <ModernInput
              label="Colore Esadecimale"
              value={editingColor?.hex_color || ''}
              onChange={(e) => setEditingColor({ ...editingColor, hex_color: e.target.value })}
              placeholder="#000000"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ModernInput
              label="Supplemento Prezzo (€)"
              type="number"
              step="0.01"
              value={editingColor?.price_modifier || 0}
              onChange={(e) => setEditingColor({ ...editingColor, price_modifier: parseFloat(e.target.value) || 0 })}
            />
            <ModernInput
              label="Ordine Visualizzazione"
              type="number"
              value={editingColor?.order_index || 0}
              onChange={(e) => setEditingColor({ ...editingColor, order_index: parseInt(e.target.value) || 0 })}
            />
          </div>

          <ImageUploadDragDrop
            label="Immagine Colore"
            value={editingColor?.image_url || ''}
            onChange={handleImageChange}
            helperText={isUploading ? 'Caricamento in corso...' : 'Carica immagine o inserisci URL'}
          />

          <div className="flex gap-3 pt-4">
            <ModernButton
              onClick={handleSave}
              loading={isSaving || isUploading}
              disabled={isUploading}
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
              disabled={isSaving || isUploading}
            >
              Annulla
            </ModernButton>
          </div>
        </div>
      </ModernModal>
    </div>
  )
}
