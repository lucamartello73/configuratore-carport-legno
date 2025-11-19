'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar'
import { adminColors } from '@/lib/admin/colors'
import { AdminConfiguratorProvider } from '@/contexts/AdminConfiguratorContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  
  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      return
    }
    
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/admin/login')
      }
    }
    
    checkAuth()
  }, [pathname, router])
  
  // Don't show sidebar on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }
  
  return (
    <AdminConfiguratorProvider>
      <div className="flex min-h-screen" style={{ backgroundColor: adminColors.background }}>
        {/* Sidebar */}
        <AdminSidebar configuratorType="legno" />
        
        {/* Main Content */}
        <main 
          className="flex-1"
          style={{
            marginLeft: '260px',
            minHeight: '100vh',
          }}
        >
          {children}
        </main>
      </div>
    </AdminConfiguratorProvider>
  )
}
