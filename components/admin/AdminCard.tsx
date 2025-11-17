"use client"

import React, { type ReactNode } from 'react'

interface AdminCardProps {
  children: ReactNode
  title?: string
  subtitle?: string
  className?: string
  hover?: boolean
}

export function AdminCard({ 
  children, 
  title, 
  subtitle, 
  className = '', 
  hover = false 
}: AdminCardProps) {
  return (
    <div className={`admin-card ${hover ? 'admin-card-hover' : ''} ${className}`}>
      {(title || subtitle) && (
        <div className="admin-card-header">
          {title && <h3 className="admin-card-title">{title}</h3>}
          {subtitle && <p className="admin-card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="admin-card-content">
        {children}
      </div>

      <style jsx>{`
        .admin-card {
          background: white;
          border: 2px solid #E0E0E0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .admin-card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          border-color: var(--admin-primary);
        }

        .admin-card-header {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #F0F0F0;
        }

        .admin-card-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--admin-primary);
          margin: 0 0 4px 0;
        }

        .admin-card-subtitle {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .admin-card-content {
          /* Content styling */
        }

        @media (max-width: 768px) {
          .admin-card {
            padding: 16px;
            border-radius: 12px;
          }

          .admin-card-header {
            margin-bottom: 16px;
            padding-bottom: 12px;
          }

          .admin-card-title {
            font-size: 16px;
          }

          .admin-card-subtitle {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  )
}
