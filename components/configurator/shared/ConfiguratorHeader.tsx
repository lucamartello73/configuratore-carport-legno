"use client"

import Link from "next/link"
import Image from "next/image"

interface ConfiguratorHeaderProps {
  title: string
  configuratorType?: string
}

export function ConfiguratorHeader({ title, configuratorType }: ConfiguratorHeaderProps) {
  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-left">
          <Link href="/">
            <Image
              src="/logo-martello.jpg"
              alt="Logo Martello 1930"
              width={120}
              height={80}
              className="header-logo"
              priority
            />
          </Link>
        </div>
        
        <div className="header-center">
          <h1 className="header-title">{title}</h1>
        </div>
        
        <div className="header-right">
          <Link href="/">
            <button className="btn-header">
              Torna alla Home
            </button>
          </Link>
        </div>
      </div>
    </header>
  )
}
