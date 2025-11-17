"use client"

// Admin button: fixed bottom-right corner, icon only
import Link from "next/link"
import { SimpleIcons } from "@/components/ui/simple-icons"

export function AdminAccessButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link 
        href="/admin/login"
        className="w-12 h-12 bg-gray-800 hover:bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
        title="Area Admin"
      >
        <SimpleIcons.Settings className="h-5 w-5" />
      </Link>
    </div>
  )
}
