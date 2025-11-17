"use client"

import React from 'react'
import { TreePine, Wrench } from 'lucide-react'
import { useAdminConfigurator, type ConfiguratorType } from '@/contexts/AdminConfiguratorContext'

export function ConfiguratorSwitch() {
  const { configuratorType, setConfiguratorType } = useAdminConfigurator()

  const handleToggle = () => {
    setConfiguratorType(configuratorType === 'legno' ? 'ferro' : 'legno')
  }

  return (
    <div className="configurator-switch-container">
      <button
        onClick={handleToggle}
        className="configurator-switch"
        aria-label={`Passa a configuratore ${configuratorType === 'legno' ? 'ferro' : 'legno'}`}
      >
        <div className={`switch-option ${configuratorType === 'legno' ? 'active' : ''}`}>
          <TreePine className="w-5 h-5" />
          <span>Legno</span>
        </div>
        <div className={`switch-option ${configuratorType === 'ferro' ? 'active' : ''}`}>
          <Wrench className="w-5 h-5" />
          <span>Ferro</span>
        </div>
        <div 
          className="switch-slider" 
          style={{
            transform: configuratorType === 'ferro' ? 'translateX(100%)' : 'translateX(0)',
          }}
        />
      </button>

      <style jsx>{`
        .configurator-switch-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .configurator-switch {
          position: relative;
          display: flex;
          background: #F5F5F5;
          border-radius: 12px;
          padding: 4px;
          cursor: pointer;
          border: none;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
        }

        .configurator-switch:hover {
          box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.1);
        }

        .switch-option {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 2;
          color: #666;
        }

        .switch-option.active {
          color: white;
        }

        .switch-slider {
          position: absolute;
          top: 4px;
          left: 4px;
          width: calc(50% - 4px);
          height: calc(100% - 8px);
          background: var(--admin-primary);
          border-radius: 8px;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        @media (max-width: 640px) {
          .switch-option span {
            display: none;
          }
          
          .switch-option {
            padding: 10px 16px;
          }
        }
      `}</style>
    </div>
  )
}
