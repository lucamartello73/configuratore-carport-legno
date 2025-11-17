"use client"

import { useConfigurator } from '@/contexts/ConfiguratorContext'

export function ConfiguratorSelector() {
  const { configuratorType, setConfiguratorType } = useConfigurator()

  return (
    <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
      <button
        onClick={() => setConfiguratorType('FERRO')}
        className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
          configuratorType === 'FERRO'
            ? 'bg-[#525252] text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        FERRO
      </button>
      <button
        onClick={() => setConfiguratorType('LEGNO')}
        className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${
          configuratorType === 'LEGNO'
            ? 'bg-[#5A3A1A] text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`}
      >
        LEGNO
      </button>
    </div>
  )
}
