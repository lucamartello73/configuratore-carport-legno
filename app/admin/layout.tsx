import { ConfiguratorProvider } from '@/contexts/ConfiguratorContext'
import { AdminConfiguratorProvider } from '@/contexts/AdminConfiguratorContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfiguratorProvider>
      <AdminConfiguratorProvider>
        {children}
      </AdminConfiguratorProvider>
    </ConfiguratorProvider>
  )
}
