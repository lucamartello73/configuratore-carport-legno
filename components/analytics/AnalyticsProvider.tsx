'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { reportWebVitals, trackPagePerformance } from '@/lib/analytics/web-vitals'
import { setupSessionTracking, trackPageView } from '@/lib/analytics/audience'

export function AnalyticsProvider() {
  const pathname = usePathname()
  
  useEffect(() => {
    // Initialize Web Vitals tracking
    reportWebVitals()
    
    // Initialize page performance tracking
    trackPagePerformance()
    
    // Initialize session tracking
    setupSessionTracking()
  }, [])
  
  useEffect(() => {
    // Track page views on route change
    if (pathname) {
      const pageTitle = document.title || 'Configuratore Carport'
      trackPageView(pathname, pageTitle)
    }
  }, [pathname])
  
  return null
}
