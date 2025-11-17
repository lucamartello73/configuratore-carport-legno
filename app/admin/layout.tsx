import { ConfiguratorProvider } from '@/contexts/ConfiguratorContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ConfiguratorProvider>{children}</ConfiguratorProvider>
}
