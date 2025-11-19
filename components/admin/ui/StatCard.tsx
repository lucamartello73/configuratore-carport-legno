import React from 'react'
import { adminColors, adminRadius, adminShadow, adminSpacing } from '@/lib/admin/colors'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: {
    value: string
    isPositive: boolean
  }
  className?: string
}

export function StatCard({ title, value, icon, trend, className = '' }: StatCardProps) {
  return (
    <div
      className={`p-6 ${className}`}
      style={{
        backgroundColor: adminColors.cardBackground,
        borderRadius: adminRadius.md,
        boxShadow: adminShadow.md,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className="text-sm font-medium mb-2"
            style={{ color: adminColors.textSecondary }}
          >
            {title}
          </p>
          <p
            className="text-3xl font-bold mb-1"
            style={{ color: adminColors.textPrimary }}
          >
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-1">
              <span
                className="text-xs font-medium"
                style={{
                  color: trend.isPositive ? adminColors.successText : adminColors.danger,
                }}
              >
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span
                className="text-xs"
                style={{ color: adminColors.textMuted }}
              >
                vs mese scorso
              </span>
            </div>
          )}
        </div>
        <div
          className="p-3"
          style={{
            backgroundColor: adminColors.background,
            borderRadius: adminRadius.md,
            color: adminColors.primary,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}
