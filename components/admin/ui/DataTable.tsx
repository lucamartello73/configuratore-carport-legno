import React from 'react'
import { adminColors, adminRadius } from '@/lib/admin/colors'

interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  emptyMessage?: string
}

export function DataTable<T>({ 
  columns, 
  data, 
  keyExtractor,
  emptyMessage = 'Nessun dato disponibile'
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div
        className="text-center py-12"
        style={{ color: adminColors.textMuted }}
      >
        {emptyMessage}
      </div>
    )
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr style={{ backgroundColor: adminColors.background }}>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ 
                  color: adminColors.textSecondary,
                  width: column.width,
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={keyExtractor(item)}
              className="border-b transition-colors hover:bg-gray-50"
              style={{ borderColor: adminColors.border }}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-4 py-4"
                  style={{ color: adminColors.textPrimary }}
                >
                  {column.render 
                    ? column.render(item) 
                    : (item as any)[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
