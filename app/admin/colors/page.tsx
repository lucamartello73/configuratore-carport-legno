"use client"

import { useEffect, useState } from 'react'
import { useConfigurator } from '@/contexts/ConfiguratorContext'
import { createClient } from '@/lib/supabase/client'
import { PlusIcon, Edit2Icon, Trash2Icon, ImageIcon } from 'lucide-react'

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

const DEMO_COLORS = [
  { name: 'Nero Opaco', code: 'RAL 9005', category: 'Struttura', hex_color: '#000000', price_modifier: 0, order_index: 1 },
  { name: 'Grigio Antracite', code: 'RAL 7016', category: 'Struttura', hex_color: '#1C1F24', price_modifier: 20, order_index: 2 },
  { name: 'Bianco Puro', code: 'RAL 9010', category: 'Struttura', hex_color: '#FFFFFF', price_modifier: 0, order_index: 3 },
  { name: 'Marrone Cioccolato', code: 'RAL 8017', category: 'Struttura', hex_color: '#3E2723', price_modifier: 30, order_index: 4 },
  { name: 'Legno Naturale', code: '–', category: 'Copertura', hex_color: '#C49A6C', price_modifier: 50, order_index: 5 },
  { name: 'Verde Muschio', code: 'RAL 6005', category: 'Copertura', hex_color: '#114232', price_modifier: 40, order_index: 6 }
]

export default function ColorsPage() {
  const { configuratorType } = useConfigurator()
  const [colors, setColors] = useState<Color[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingColor, setEditingColor] = useState<Partial<Color> | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    loadColors()
  }, [configuratorType])

  const loadColors = async () => {
    setLoading(true)
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('carport_colors')
      .select('*')
      .eq('configurator_type', configuratorType)
      .order('order_index', { ascending: true })

    if (!error && data) {
      setColors(data)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    if (!editingColor?.name) return
    
    setSaving(true)
    const supabase = createClient()
    
    const colorData = {
      ...editingColor,
      configurator_type: configuratorType,
      order_index: editingColor.order_index || colors.length + 1
    }

    if (editingColor.id) {
      const { error } = await supabase
        .from('carport_colors')
        .update(colorData)
        .eq('id', editingColor.id)
      
      if (!error) {
        await loadColors()
        setIsModalOpen(false)
        setEditingColor(null)
      }
    } else {
      const { error } = await supabase
        .from('carport_colors')
        .insert([colorData])
      
      if (!error) {
        await loadColors()
        setIsModalOpen(false)
        setEditingColor(null)
      }
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo colore?')) return
    
    const supabase = createClient()
    const { error } = await supabase
      .from('carport_colors')
      .delete()
      .eq('id', id)
    
    if (!error) {
      await loadColors()
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    const supabase = createClient()
    
    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('colors')
      .upload(fileName, file)
    
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage
        .from('colors')
        .getPublicUrl(data.path)
      
      setEditingColor(prev => ({ ...prev, image_url: publicUrl }))
    }
    setUploadingImage(false)
  }

  const loadDemoColors = async () => {
    const supabase = createClient()
    const colorsToInsert = DEMO_COLORS.map(c => ({
      ...c,
      configurator_type: configuratorType
    }))
    
    const { error } = await supabase
      .from('carport_colors')
      .insert(colorsToInsert)
    
    if (!error) {
      await loadColors()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Caricamento colori...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestione Colori</h2>
            <p className="mt-1 text-sm text-gray-600">
              Configura i colori disponibili per il configuratore {configuratorType}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadDemoColors}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Carica Colori Demo
            </button>
            <button
              onClick={() => {
                setEditingColor({})
                setIsModalOpen(true)
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Nuovo Colore
            </button>
          </div>
        </div>
      </div>

      {/* Colors Grid */}
      {colors.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun colore disponibile</h3>
          <p className="text-gray-600 mb-6">Inizia aggiungendo colori manualmente o carica i colori demo</p>
          <button
            onClick={loadDemoColors}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Carica Colori Demo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {colors.map((color) => (
            <div
              key={color.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Color Preview */}
              <div className="relative h-40 bg-gray-100">
                {color.image_url ? (
                  <img
                    src={color.image_url}
                    alt={color.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: color.hex_color || '#CCCCCC' }}
                  >
                    <span className="text-white font-bold text-3xl drop-shadow-lg">
                      {color.code || color.hex_color}
                    </span>
                  </div>
                )}
                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-semibold text-gray-700">
                  {configuratorType}
                </div>
              </div>

              {/* Color Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{color.name}</h3>
                {color.code && (
                  <p className="text-sm text-gray-600 mb-2">{color.code}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{color.category}</span>
                  {color.price_modifier !== 0 && (
                    <span className="font-medium text-blue-600">
                      {color.price_modifier > 0 ? '+' : ''}{color.price_modifier}€
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setEditingColor(color)
                      setIsModalOpen(true)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Edit2Icon className="w-4 h-4" />
                    Modifica
                  </button>
                  <button
                    onClick={() => handleDelete(color.id)}
                    className="flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingColor?.id ? 'Modifica Colore' : 'Nuovo Colore'}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Colore
                </label>
                <input
                  type="text"
                  value={editingColor?.name || ''}
                  onChange={(e) => setEditingColor(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="es. Nero Opaco"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Codice RAL (opzionale)
                </label>
                <input
                  type="text"
                  value={editingColor?.code || ''}
                  onChange={(e) => setEditingColor(prev => ({ ...prev, code: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="es. RAL 9005"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Colore Hex
                </label>
                <input
                  type="text"
                  value={editingColor?.hex_color || ''}
                  onChange={(e) => setEditingColor(prev => ({ ...prev, hex_color: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={editingColor?.category || 'Struttura'}
                  onChange={(e) => setEditingColor(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Struttura">Struttura</option>
                  <option value="Copertura">Copertura</option>
                  <option value="Accessori">Accessori</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modificatore Prezzo (€)
                </label>
                <input
                  type="number"
                  value={editingColor?.price_modifier || 0}
                  onChange={(e) => setEditingColor(prev => ({ ...prev, price_modifier: Number(e.target.value) }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Immagine (opzionale)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {uploadingImage && <p className="text-sm text-gray-600 mt-2">Caricamento immagine...</p>}
                {editingColor?.image_url && (
                  <img src={editingColor.image_url} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setEditingColor(null)
                }}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {saving ? 'Salvataggio...' : 'Salva'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
