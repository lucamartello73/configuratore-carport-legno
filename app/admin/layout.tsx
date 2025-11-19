import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar'
import { adminColors } from '@/lib/admin/colors'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/admin/login')
  }
  
  return (
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
  )
}
