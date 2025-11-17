"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminConfigurator } from '@/contexts/AdminConfiguratorContext'
import { createClient } from '@/lib/supabase/client'
import { getAdminSession } from '@/lib/auth/admin-auth'
import { PlusIcon, Edit2Icon, Trash2Icon, PackageIcon } from 'lucide-react'
import { ModernCard } from '@/components/admin/ui/ModernCard'
import { ModernButton } from '@/components/admin/ui/ModernButton'
import { ModernInput } from '@/components/admin/ui/ModernInput'
import { ModernSelect } from '@/components/admin/ui/ModernSelect'
import { ModernModal } from '@/components/admin/ui/ModernModal'
import { ImageUploadDragDrop } from '@/components/admin/ui/ImageUploadDragDrop'

interface Model {
  id: string
  name: string
  description: string
  base_price: number
  image: string
  structure_type_id: string | null
  order_index: number
  created_at: string
  structure_type?: {
    id: string
    name: string
    structure_category: string
  }
}

interface StructureType {
  id: string
  name: string
  structure_category: string
}

// Demo models for quick setup
const getDemoModels = (configuratorType: 'FERRO' | 'LEGNO') => [
  { 
    name: `Carport Standard 3x5 ${configuratorType}`, 
    description: 'Carport base con struttura robusta, ideale per 1 auto',
    base_price: configuratorType === 'FERRO' ? 2500 : 2800, 
    image: '',
    structure_type_id: null,
    order_index: 1
  },
  { 
    name: `Carport Premium 4x6 ${configuratorType}`, 
    description: 'Carport di fascia alta con finiture premium, protezione completa',
    base_price: configuratorType === 'FERRO' ? 4200 : 4600, 
    image: '',
    structure_type_id: null,
    order_index: 2
  },
  { 
    name: `Carport Doppio 6x6 ${configuratorType}`, 
    description: 'Carport doppio per 2 auto, struttura rinforzata',
    base_price: configuratorType === 'FERRO' ? 6800 : 7200, 
    image: '',
    structure_type_id: null,
    order_index: 3
  },
  { 
    name: `Carport Addossato 3x4.5 ${configuratorType}`, 
    description: 'Carport da parete, ottimizza lo spazio laterale',
    base_price: configuratorType === 'FERRO' ? 2100 : 2400, 
    image: '',
    structure_type_id: null,
    order_index: 4
  },
]

export default function ModelsPage() {
  // Auth and routing
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [session, setSession] = useState<any>(null)
  
  // Data state
  const { configuratorType, configuratorTypeUpper } = useAdminConfigurator()
  const [models, setModels] = useState<Model[]>([])
  const [structureTypes, setStructureTypes] = useState<StructureType[]>([])
  const [loading, setLoading] = useState(true)
  
  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingModel, setEditingModel] = useState<Partial<Model> | null>(null)
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

  // Fetch models and structure types
  useEffect(() => {
    if (session) {
      fetchStructureTypes()
    }
  }, [configuratorType, session])

  useEffect(() => {
    if (structureTypes.length > 0) {
      fetchModels()
    }
  }, [structureTypes, configuratorType])

  async function fetchStructureTypes() {
    try {
      const { data, error } = await supabase
        .from('carport_structure_types')
        .select('id, name, structure_category')
        .eq('structure_category', configuratorTypeUpper)
        .eq('attivo', true)
        .order('name')

      if (error) throw error
      setStructureTypes(data || [])
    } catch (error) {
      console.error('Errore caricamento tipi struttura:', error)
      setStructureTypes([])
    }
  }

  async function fetchModels() {
    try {
      setLoading(true)
      
      // Usa tabella diversa in base al configuratore
      const tableName = configuratorType === 'legno' ? 'carport_legno_models' : 'carport_models'
      const structureTableName = configuratorType === 'legno' ? 'carport_legno_structure_types' : 'carport_structure_types'
      
      // Get structure type IDs for current configurator
      const structureTypeIds = structureTypes.map(st => st.id)
      
      if (structureTypeIds.length === 0) {
        setModels([])
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from(tableName)
        .select(`
          *,
          structure_type:${structureTableName}(id, name)
        `)
        .in('structure_type_id', structureTypeIds)
        .order('name')

      if (error) throw error
      setModels(data || [])
    } catch (error) {
      console.error('Errore caricamento modelli:', error)
      alert('Errore nel caricamento dei modelli')
      setModels([])
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateDemo() {
    try {
      setIsSaving(true)
      
      // Get first available structure type for current configurator
      if (structureTypes.length === 0) {
        alert('⚠️ Nessun tipo di struttura disponibile per ' + configuratorType + '. Crea prima almeno un tipo di struttura.')
        return
      }

      const defaultStructureTypeId = structureTypes[0].id
      const demoData = getDemoModels(configuratorType).map(model => ({
        ...model,
        structure_type_id: defaultStructureTypeId,
        created_at: new Date().toISOString(),
      }))

      const tableName = configuratorType === 'legno' ? 'carport_legno_models' : 'carport_models'
      const { error } = await supabase
        .from(tableName)
        .insert(demoData)

      if (error) throw error
      
      alert(`✅ ${demoData.length} modelli demo creati con successo!`)
      fetchModels()
    } catch (error: any) {
      console.error('Errore creazione demo:', error)
      alert('Errore nella creazione dei modelli demo: ' + (error.message || 'Unknown error'))
    } finally {
      setIsSaving(false)
    }
  }

  function openCreateModal() {
    setEditingModel({
      name: '',
      description: '',
      base_price: 0,
      image: '',
      structure_type_id: structureTypes.length > 0 ? structureTypes[0].id : null,
      order_index: models.length + 1,
    })
    setIsModalOpen(true)
  }

  function openEditModal(model: Model) {
    setEditingModel({ ...model })
    setIsModalOpen(true)
  }

  async function handleSave() {
    if (!editingModel?.name || !editingModel?.base_price) {
      alert('Compila i campi obbligatori: Nome e Prezzo Base')
      return
    }

    if (!editingModel?.structure_type_id) {
      alert('⚠️ Seleziona un tipo di struttura per questo modello')
      return
    }

    try {
      setIsSaving(true)

      const modelData = {
        name: editingModel.name,
        description: editingModel.description || '',
        base_price: editingModel.base_price,
        image: editingModel.image || '',
        structure_type_id: editingModel.structure_type_id,
        updated_at: new Date().toISOString(),
      }

      const tableName = configuratorType === 'legno' ? 'carport_legno_models' : 'carport_models'
      
      if (editingModel.id) {
        // Update existing
        const { error } = await supabase
          .from(tableName)
          .update(modelData)
          .eq('id', editingModel.id)

        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from(tableName)
          .insert([modelData])

        if (error) throw error
      }

      setIsModalOpen(false)
      setEditingModel(null)
      fetchModels()
    } catch (error: any) {
      console.error('Errore salvataggio modello:', error)
      alert('Errore nel salvataggio del modello: ' + (error.message || 'Unknown error'))
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Sei sicuro di voler eliminare il modello "${name}"?`)) return

    try {
      // Check if model is used in configurations
      const { data: usageCheck, error: checkError } = await supabase
        .from('carport_configurations')
        .select('id, customer_name')
        .eq('model_id', id)
        .limit(5)

      if (checkError) throw checkError

      if (usageCheck && usageCheck.length > 0) {
        const customerNames = usageCheck.map(c => c.customer_name).join(', ')
        const moreText = usageCheck.length === 5 ? ' e altri...' : ''
        alert(
          `❌ Impossibile eliminare il modello.\n\n` +
          `È utilizzato in ${usageCheck.length} configurazione/i di:\n${customerNames}${moreText}\n\n` +
          `Elimina prima le configurazioni che lo utilizzano.`
        )
        return
      }

      const tableName = configuratorType === 'legno' ? 'carport_legno_models' : 'carport_models'
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)

      if (error) throw error
      
      fetchModels()
    } catch (error) {
      console.error('Errore eliminazione modello:', error)
      alert('Errore durante l\'eliminazione del modello')
    }
  }

  function handleImageUpload(url: string) {
    setEditingModel(prev => prev ? { ...prev, image: url } : null)
  }

  // Loading state during SSR
  if (!mounted || !session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <PackageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-500">Caricamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <PackageIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Modelli Carport</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Gestisci i modelli di carport disponibili per {configuratorType}
          </p>
        </div>
        
        <div className="flex gap-3">
          {models.length === 0 && structureTypes.length > 0 && (
            <ModernButton
              variant="outline"
              onClick={handleCreateDemo}
              disabled={isSaving}
            >
              ✨ Crea Demo
            </ModernButton>
          )}
          <ModernButton 
            onClick={openCreateModal}
            disabled={structureTypes.length === 0}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Nuovo Modello
          </ModernButton>
        </div>
      </div>

      {/* Warning se non ci sono structure types */}
      {structureTypes.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Nessun tipo di struttura disponibile
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Per creare modelli per <strong>{configuratorType}</strong>, devi prima creare almeno un tipo di struttura nella sezione "Tipi Struttura".
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
        <PackageIcon className="w-5 h-5 text-blue-600" />
        <span className="text-sm font-medium text-blue-900">
          {models.length} modelli per <span className="font-bold">{configuratorType}</span>
        </span>
      </div>

      {/* Models Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48" />
              <div className="mt-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : models.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
          <PackageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nessun modello trovato
          </h3>
          <p className="text-gray-500 mb-6">
            {structureTypes.length === 0 
              ? `Crea prima un tipo di struttura per ${configuratorType}`
              : `Crea il primo modello per ${configuratorType} o importa i dati demo`
            }
          </p>
          <div className="flex gap-3 justify-center">
            {structureTypes.length > 0 && (
              <>
                <ModernButton variant="outline" onClick={handleCreateDemo}>
                  ✨ Crea Demo
                </ModernButton>
                <ModernButton onClick={openCreateModal}>
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Nuovo Modello
                </ModernButton>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {models.map(model => (
            <ModernCard
              key={model.id}
              title={model.name}
              description={model.description}
              image={model.image}
              badge={
                <span className={`px-2 py-1 text-xs font-semibold rounded ${
                  configuratorType === 'FERRO' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {configuratorType}
                </span>
              }
              metadata={[
                { label: 'Prezzo Base', value: `€ ${model.base_price.toFixed(2)}` },
                { 
                  label: 'Tipo Struttura', 
                  value: model.structure_type?.name || 'Non assegnato' 
                },
              ]}
              actions={
                <>
                  <ModernButton
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditModal(model)}
                  >
                    <Edit2Icon className="w-4 h-4" />
                  </ModernButton>
                  <ModernButton
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(model.id, model.name)}
                  >
                    <Trash2Icon className="w-4 h-4 text-red-500" />
                  </ModernButton>
                </>
              }
            />
          ))}
        </div>
      )}

      {/* Modal Create/Edit */}
      <ModernModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingModel(null)
        }}
        title={editingModel?.id ? 'Modifica Modello' : 'Nuovo Modello'}
        size="lg"
      >
        <div className="space-y-6">
          {/* Nome */}
          <ModernInput
            label="Nome Modello *"
            value={editingModel?.name || ''}
            onChange={(e) => setEditingModel(prev => prev ? { ...prev, name: e.target.value } : null)}
            placeholder="es: Carport Standard 3x5"
            required
          />

          {/* Descrizione */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Descrizione
            </label>
            <textarea
              value={editingModel?.description || ''}
              onChange={(e) => setEditingModel(prev => prev ? { ...prev, description: e.target.value } : null)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Descrizione dettagliata del modello..."
            />
          </div>

          {/* Prezzo Base */}
          <ModernInput
            label="Prezzo Base (€) *"
            type="number"
            step="0.01"
            value={editingModel?.base_price || 0}
            onChange={(e) => setEditingModel(prev => prev ? { ...prev, base_price: parseFloat(e.target.value) } : null)}
            placeholder="2500.00"
            required
          />

          {/* Tipo Struttura */}
          <ModernSelect
            label="Tipo Struttura *"
            value={editingModel?.structure_type_id || ''}
            onChange={(e) => setEditingModel(prev => prev ? { ...prev, structure_type_id: e.target.value || null } : null)}
            options={[
              { value: '', label: 'Seleziona tipo struttura...' },
              ...structureTypes.map(st => ({
                value: st.id,
                label: st.name
              }))
            ]}
            required
          />

          {/* Image Upload */}
          <ImageUploadDragDrop
            label="Immagine Modello"
            value={editingModel?.image || ''}
            onChange={handleImageUpload}
            isUploading={isUploading}
            onUploadStart={() => setIsUploading(true)}
            onUploadComplete={() => setIsUploading(false)}
            description="Trascina un'immagine qui o clicca per selezionare (consigliato 800x600px)"
          />

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <ModernButton
              variant="outline"
              onClick={() => {
                setIsModalOpen(false)
                setEditingModel(null)
              }}
              disabled={isSaving || isUploading}
            >
              Annulla
            </ModernButton>
            <ModernButton
              onClick={handleSave}
              disabled={isSaving || isUploading || !editingModel?.name || !editingModel?.base_price || !editingModel?.structure_type_id}
            >
              {isSaving ? 'Salvataggio...' : (editingModel?.id ? 'Salva Modifiche' : 'Crea Modello')}
            </ModernButton>
          </div>
        </div>
      </ModernModal>
    </div>
  )
}
