import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { AdminAccessButton } from "@/components/admin-access-button"
import "./globals.css"

export const metadata: Metadata = {
  title: "Configuratore Carport - Progetta il tuo carport personalizzato",
  description:
    "Configura e personalizza il tuo carport in 7 semplici passaggi. Scegli dimensioni, colori, copertura e ricevi un preventivo istantaneo.",
  generator: "Carport Configurator",
  keywords: "carport, configuratore, personalizzato, preventivo, struttura, copertura",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="it">
      <body className="font-sans antialiased">
        <AdminAccessButton />
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </body>
    </html>
  )
}
