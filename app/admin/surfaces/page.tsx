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
import { ModernButton } from '@/components/admin/ui/ModernButton'
import { ModernModal } from '@/components/admin/ui/ModernModal'
import { ImageUploadDragDrop } from '@/components/admin/ui/ImageUploadDragDrop'
import { useConfigurator } from '@/contexts/ConfiguratorContext'
import { createClient } from '@/lib/supabase/client'
import { PlusIcon, Edit2Icon, Trash2Icon } from 'lucide-react'

interface Surface {
  id: string
  name: string
  description?: string
  image_url?: string
  price_per_sqm: number
  compatibile_con?: string
  attivo: boolean
  ordine: number
  configurator_type: 'FERRO' | 'LEGNO'
  created_at: string
}

const DEMO_SURFACES = [
  { name: 'Policarbonato Trasparente', description: 'Resistente agli UV, trasmissione luce 90%', price_per_sqm: 45, ordine: 1, attivo: true },
  { name: 'Policarbonato Opale', description: 'Luce diffusa, privacy garantita', price_per_sqm: 50, ordine: 2, attivo: true },
  { name: 'Tegola Metallica', description: 'Acciaio zincato verniciato, alta resistenza', price_per_sqm: 75, ordine: 3, attivo: true },
  { name: 'Lamiera Grecata', description: 'Profilo ondulato, drenaggio ottimale', price_per_sqm: 38, ordine: 4, attivo: true },
  { name: 'Vetro Temperato', description: 'Massima trasparenza e sicurezza', price_per_sqm: 120, ordine: 5, attivo: true },
  { name: 'Pannello Sandwich', description: 'Isolamento termico superiore', price_per_sqm: 95, ordine: 6, attivo: true }
]

export default function SurfacesPage() {
  const { configuratorType } = useConfigurator()
  const [surfaces, setSurfaces] = useState<Surface[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSurface, setEditingSurface] = useState<Partial<Surface> | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadSurfaces()
  }, [configuratorType])

  async function loadSurfaces() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('carport_surfaces')
        .select('*')
        .eq('configurator_type', configuratorType)
        .order('ordine')
        .order('name')

      if (error) throw error
      setSurfaces(data || [])
    } catch (error) {
      console.error('Errore caricamento superfici:', error)
      alert('Errore nel caricamento delle superfici')
    } finally {
      setLoading(false)
    }
  }

  async function createDemoSurfaces() {
    try {
      setSaving(true)
      const demoData = DEMO_SURFACES.map(surface => ({
        ...surface,
        configurator_type: configuratorType
      }))

      const { error } = await supabase
        .from('carport_surfaces')
        .insert(demoData)

      if (error) throw error
      await loadSurfaces()
      alert(`${DEMO_SURFACES.length} superfici demo create per ${configuratorType}`)
    } catch (error) {
      console.error('Errore creazione demo:', error)
      alert('Errore nella creazione delle superfici demo')
    } finally {
      setSaving(false)
    }
  }

  async function uploadImageToSupabase(file: File): Promise<string> {
    try {
      setUploadingImage(true)
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${configuratorType.toLowerCase()}-surface-${Date.now()}.${fileExt}`
      const filePath = `surfaces/${fileName}`

      const { error: uploadError } = await supabase.storage
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
      setUploadingImage(false)
    }
  }

  async function handleImageChange(urlOrFile: string) {
    if (urlOrFile.startsWith('data:image') || urlOrFile.startsWith('blob:')) {
      try {
        const response = await fetch(urlOrFile)
        const blob = await response.blob()
        const file = new File([blob], 'surface-image.jpg', { type: blob.type })
        
        const publicUrl = await uploadImageToSupabase(file)
        setEditingSurface({ ...editingSurface, image_url: publicUrl })
      } catch (error) {
        console.error('Errore conversione immagine:', error)
        alert('Errore nel caricamento dell\'immagine')
      }
    } else {
      setEditingSurface({ ...editingSurface, image_url: urlOrFile })
    }
  }

  async function handleSave() {
    if (!editingSurface?.name) {
      alert('Il nome è obbligatorio')
      return
    }

    try {
      setSaving(true)
      
      const surfaceData = {
        name: editingSurface.name,
        description: editingSurface.description || null,
        image_url: editingSurface.image_url || null,
        price_per_sqm: editingSurface.price_per_sqm || 0,
        compatibile_con: editingSurface.compatibile_con || null,
        attivo: editingSurface.attivo !== undefined ? editingSurface.attivo : true,
        ordine: editingSurface.ordine || 0,
        configurator_type: configuratorType
      }

      if (editingSurface.id) {
        const { error } = await supabase
          .from('carport_surfaces')
          .update(surfaceData)
          .eq('id', editingSurface.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('carport_surfaces')
          .insert([surfaceData])

        if (error) throw error
      }

      await loadSurfaces()
      setIsModalOpen(false)
      setEditingSurface(null)
    } catch (error) {
      console.error('Errore salvataggio:', error)
      alert('Errore nel salvataggio della superficie')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Sei sicuro di voler eliminare questa superficie?')) return

    try {
      const { error } = await supabase
        .from('carport_surfaces')
        .delete()
        .eq('id', id)

      if (error) throw error
      await loadSurfaces()
    } catch (error) {
      console.error('Errore eliminazione:', error)
      alert('Errore nell\'eliminazione della superficie')
    }
  }

  async function toggleActive(id: string, currentState: boolean) {
    try {
      const { error } = await supabase
        .from('carport_surfaces')
        .update({ attivo: !currentState })
        .eq('id', id)

      if (error) throw error
      await loadSurfaces()
    } catch (error) {
      console.error('Errore toggle attivo:', error)
      alert('Errore nell\'aggiornamento dello stato')
    }
  }

  function openModal(surface?: Surface) {
    setEditingSurface(surface || { 
      configurator_type: configuratorType,
      price_per_sqm: 0,
      ordine: surfaces.length + 1,
      attivo: true
    })
    setIsModalOpen(true)
  }

  return (
    <ModernAdminWrapper title="Gestione Superfici">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestione Superfici</h1>
            <p className="text-gray-600 mt-2">
              Configuratore: <span className={`font-semibold ${
                configuratorType === 'FERRO' ? 'text-[#525252]' : 'text-[#5A3A1A]'
              }`}>{configuratorType}</span>
            </p>
          </div>
          <ModernButton
            onClick={() => openModal()}
            icon={<PlusIcon className="w-5 h-5" />}
            size="lg"
          >
            Nuova Superficie
          </ModernButton>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <ModernCard>
          <ModernCardContent className="py-16 text-center">
            <div className="inline-flex items-center gap-3 text-gray-600">
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Caricamento superfici...</span>
            </div>
          </ModernCardContent>
        </ModernCard>
      ) : surfaces.length === 0 ? (
        /* Empty State */
        <ModernCard>
          <ModernCardContent className="py-16 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nessuna superficie disponibile
            </h3>
            <p className="text-gray-600 mb-6">
              Inizia creando superfici manualmente o carica le superfici demo
            </p>
            <div className="flex items-center justify-center gap-3">
              <ModernButton onClick={() => openModal()}>
                Crea Nuova Superficie
              </ModernButton>
              <ModernButton 
                variant="secondary" 
                onClick={createDemoSurfaces}
                loading={saving}
              >
                Carica Superfici Demo
              </ModernButton>
            </div>
          </ModernCardContent>
        </ModernCard>
      ) : (
        /* Grid Superfici */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {surfaces.map((surface) => (
            <ModernCard key={surface.id} className="hover:shadow-lg transition-shadow">
              <ModernCardContent className="p-0">
                {/* Immagine */}
                <div className="relative h-48 rounded-t-xl overflow-hidden bg-gray-100">
                  {surface.image_url ? (
                    <img
                      src={surface.image_url}
                      alt={surface.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-sm">Nessuna immagine</span>
                    </div>
                  )}
                  
                  {/* Badge Tipo + Stato */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold shadow-lg ${
                      surface.configurator_type === 'FERRO' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-amber-700 text-white'
                    }`}>
                      {surface.configurator_type}
                    </span>
                    
                    {!surface.attivo && (
                      <span className="bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
                        Disattivo
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{surface.name}</h3>
                    {surface.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{surface.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Prezzo/m²</span>
                    <span className="font-semibold text-gray-900">{surface.price_per_sqm}€</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Ordine: {surface.ordine}</span>
                      <button
                        onClick={() => toggleActive(surface.id, surface.attivo)}
                        className={`text-xs px-2 py-1 rounded ${
                          surface.attivo 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {surface.attivo ? 'Attivo' : 'Off'}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(surface)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Modifica"
                      >
                        <Edit2Icon className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(surface.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Elimina"
                      >
                        <Trash2Icon className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </ModernCardContent>
            </ModernCard>
          ))}
        </div>
      )}

      {/* Modal Crea/Modifica */}
      <ModernModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSurface(null)
        }}
        title={editingSurface?.id ? 'Modifica Superficie' : 'Nuova Superficie'}
        size="lg"
      >
        <div className="space-y-6">
          <ModernInput
            label="Nome Superficie"
            value={editingSurface?.name || ''}
            onChange={(e) => setEditingSurface({ ...editingSurface, name: e.target.value })}
            required
            placeholder="es. Policarbonato Trasparente"
          />

          <ModernInput
            label="Descrizione"
            value={editingSurface?.description || ''}
            onChange={(e) => setEditingSurface({ ...editingSurface, description: e.target.value })}
            placeholder="Caratteristiche tecniche..."
          />

          <div className="grid grid-cols-2 gap-4">
            <ModernInput
              label="Prezzo per m² (€)"
              type="number"
              step="0.01"
              value={editingSurface?.price_per_sqm || 0}
              onChange={(e) => setEditingSurface({ ...editingSurface, price_per_sqm: parseFloat(e.target.value) || 0 })}
              required
            />

            <ModernInput
              label="Ordine Visualizzazione"
              type="number"
              value={editingSurface?.ordine || 0}
              onChange={(e) => setEditingSurface({ ...editingSurface, ordine: parseInt(e.target.value) || 0 })}
            />
          </div>

          <ModernInput
            label="Compatibile Con (opzionale)"
            value={editingSurface?.compatibile_con || ''}
            onChange={(e) => setEditingSurface({ ...editingSurface, compatibile_con: e.target.value })}
            placeholder="es. Struttura in acciaio"
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="attivo"
              checked={editingSurface?.attivo !== false}
              onChange={(e) => setEditingSurface({ ...editingSurface, attivo: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="attivo" className="text-sm font-semibold text-gray-700">
              Superficie attiva (visibile nel configuratore)
            </label>
          </div>

          <ImageUploadDragDrop
            label="Immagine Superficie"
            value={editingSurface?.image_url || ''}
            onChange={handleImageChange}
            helperText={uploadingImage ? 'Caricamento in corso...' : 'Carica immagine della superficie'}
          />

          <div className="flex gap-3 pt-4">
            <ModernButton
              onClick={handleSave}
              loading={saving || uploadingImage}
              disabled={uploadingImage}
              className="flex-1"
            >
              {editingSurface?.id ? 'Salva Modifiche' : 'Crea Superficie'}
            </ModernButton>
            <ModernButton
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false)
                setEditingSurface(null)
              }}
              className="flex-1"
              disabled={saving || uploadingImage}
            >
              Annulla
            </ModernButton>
          </div>
        </div>
      </ModernModal>
    </ModernAdminWrapper>
  )
}
