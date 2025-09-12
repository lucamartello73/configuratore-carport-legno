import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MARTELLO 1930</h1>
            <p className="text-gray-600">Configuratore Pergole in Legno</p>
          </div>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Link>
        </Button>
      </div>
    </header>
  )
}
