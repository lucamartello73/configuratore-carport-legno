'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AdminHeader } from '@/components/admin/layout/AdminHeader'
import { ConfiguratorSwitch } from '@/components/admin/layout/ConfiguratorSwitch'
import { DataTable } from '@/components/admin/ui/DataTable'
import { AdminButton, PillButton } from '@/components/admin/ui/AdminButton'
import { StatusBadge } from '@/components/admin/ui/Badge'
import { adminColors, adminRadius, adminShadow, adminSpacing } from '@/lib/admin/colors'
import Image from 'next/image'

interface Model {
  id: string
  name: string
  order_index: number
  min_depth: number
  max_depth: number
  min_width: number
  max_width: number
  structure_material: string
  base_price: number
  is_active: boolean
  image_url: string | null
  created_at: string
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  
  useEffect(() => {
    fetchModels()
  }, [])
  
  const fetchModels = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('carport_ferro_models')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (!error && data) {
      setModels(data)
    }
    setLoading(false)
  }
  
  const toggleActive = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    const { error } = await supabase
      .from('carport_ferro_models')
      .update({ is_active: !currentStatus })
      .eq('id', id)
    
    if (!error) {
      fetchModels()
    }
  }
  
  const deleteModel = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo modello?')) return
    
    const supabase = createClient()
    const { error } = await supabase
      .from('carport_ferro_models')
      .delete()
      .eq('id', id)
    
    if (!error) {
      fetchModels()
    }
  }
  
  const columns = [
    {
      key: 'order_index',
      label: 'Ordine',
      width: '80px',
      render: (model: Model) => (
        <span className="font-medium">{model.order_index}</span>
      ),
    },
    {
      key: 'image',
      label: 'Immagine',
      width: '100px',
      render: (model: Model) => (
        <div
          className="relative overflow-hidden"
          style={{
            width: '60px',
            height: '60px',
            borderRadius: adminRadius.sm,
            backgroundColor: adminColors.background,
          }}
        >
          {model.image_url ? (
            <Image
              src={model.image_url}
              alt={model.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-6 h-6" style={{ color: adminColors.textMuted }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Nome',
      render: (model: Model) => (
        <div>
          <p className="font-medium">{model.name}</p>
          <p className="text-xs" style={{ color: adminColors.textSecondary }}>
            ID: {model.id.slice(0, 8)}
          </p>
        </div>
      ),
    },
    {
      key: 'depth_range',
      label: 'Range Profondità',
      render: (model: Model) => (
        <span className="text-sm">
          {model.min_depth}m - {model.max_depth}m
        </span>
      ),
    },
    {
      key: 'width_range',
      label: 'Range Larghezza',
      render: (model: Model) => (
        <span className="text-sm">
          {model.min_width}m - {model.max_width}m
        </span>
      ),
    },
    {
      key: 'structure_material',
      label: 'Materiale',
      render: (model: Model) => (
        <span className="text-sm">{model.structure_material || 'N/A'}</span>
      ),
    },
    {
      key: 'base_price',
      label: 'Prezzo Base',
      render: (model: Model) => (
        <span className="font-semibold">€{model.base_price.toFixed(2)}</span>
      ),
    },
    {
      key: 'is_active',
      label: 'Stato',
      width: '120px',
      render: (model: Model) => (
        <StatusBadge active={model.is_active} />
      ),
    },
    {
      key: 'actions',
      label: 'Azioni',
      width: '200px',
      render: (model: Model) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleActive(model.id, model.is_active)}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: adminColors.background,
              color: adminColors.textPrimary,
            }}
            title={model.is_active ? 'Disattiva' : 'Attiva'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {model.is_active ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              )}
            </svg>
          </button>
          
          <button
            onClick={() => {/* TODO: Edit */}}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: adminColors.background,
              color: adminColors.textPrimary,
            }}
            title="Modifica"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => deleteModel(model.id)}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: '#FEE2E2',
              color: adminColors.danger,
            }}
            title="Elimina"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ),
    },
  ]
  
  return (
    <div>
      {/* Header */}
      <AdminHeader
        title="Modelli Carport"
        subtitle="Gestisci i modelli disponibili nel configuratore"
        configuratorType="ferro"
      />
      
      {/* Switch & Actions */}
      <div
        className="flex items-center justify-between"
        style={{ padding: adminSpacing.lg, paddingTop: 0 }}
      >
        <ConfiguratorSwitch current="ferro" />
        
        <PillButton
          onClick={() => setShowForm(true)}
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Nuovo Modello
        </PillButton>
      </div>
      
      {/* Table */}
      <div style={{ padding: adminSpacing.lg, paddingTop: 0 }}>
        <div
          className="overflow-hidden"
          style={{
            backgroundColor: adminColors.cardBackground,
            borderRadius: adminRadius.md,
            boxShadow: adminShadow.md,
          }}
        >
          {loading ? (
            <div
              className="text-center py-12"
              style={{ color: adminColors.textMuted }}
            >
              Caricamento...
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={models}
              keyExtractor={(model) => model.id}
              emptyMessage="Nessun modello trovato. Clicca su 'Nuovo Modello' per iniziare."
            />
          )}
        </div>
      </div>
    </div>
  )
}
