"use client"

import Link from "next/link"
import { SimpleIcons } from "@/components/ui/simple-icons"
import { Button } from "@/components/ui/button"

export function AdminAccessButton() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Link href="/admin/login">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-gray-300 hover:bg-gray-50 shadow-sm"
        >
          <SimpleIcons.Settings className="h-4 w-4 mr-2" />
          Admin
        </Button>
      </Link>
    </div>
  )
}
