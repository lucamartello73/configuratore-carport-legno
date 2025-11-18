import { track } from '@vercel/analytics'

// User properties per Vercel Analytics Pro
export interface UserProperties {
  user_type?: 'new' | 'returning'
  device_type?: 'mobile' | 'tablet' | 'desktop'
  browser?: string
  os?: string
  language?: string
  screen_resolution?: string
  viewport_size?: string
  referrer_domain?: string
  session_duration?: number
  pages_viewed?: number
}

// Detect device type
export function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

// Get browser info
export function getBrowserInfo(): string {
  if (typeof window === 'undefined') return 'unknown'
  
  const ua = navigator.userAgent
  if (ua.includes('Chrome')) return 'Chrome'
  if (ua.includes('Safari')) return 'Safari'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Edge')) return 'Edge'
  return 'Other'
}

// Get OS info
export function getOSInfo(): string {
  if (typeof window === 'undefined') return 'unknown'
  
  const ua = navigator.userAgent
  if (ua.includes('Win')) return 'Windows'
  if (ua.includes('Mac')) return 'macOS'
  if (ua.includes('Linux')) return 'Linux'
  if (ua.includes('Android')) return 'Android'
  if (ua.includes('iOS')) return 'iOS'
  return 'Other'
}

// Get referrer domain
export function getReferrerDomain(): string {
  if (typeof document === 'undefined') return 'direct'
  
  const referrer = document.referrer
  if (!referrer) return 'direct'
  
  try {
    const url = new URL(referrer)
    return url.hostname
  } catch {
    return 'unknown'
  }
}

// Check if user is new or returning
export function getUserType(): 'new' | 'returning' {
  if (typeof localStorage === 'undefined') return 'new'
  
  const hasVisited = localStorage.getItem('has_visited')
  if (hasVisited) return 'returning'
  
  localStorage.setItem('has_visited', 'true')
  return 'new'
}

// Track user session start
export function trackSessionStart() {
  const properties: UserProperties = {
    user_type: getUserType(),
    device_type: getDeviceType(),
    browser: getBrowserInfo(),
    os: getOSInfo(),
    language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
    screen_resolution: typeof window !== 'undefined' 
      ? `${window.screen.width}x${window.screen.height}` 
      : 'unknown',
    viewport_size: typeof window !== 'undefined'
      ? `${window.innerWidth}x${window.innerHeight}`
      : 'unknown',
    referrer_domain: getReferrerDomain(),
  }
  
  track('session_start', properties)
  
  // Store session start time
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('session_start', Date.now().toString())
  }
}

// Track user session end
export function trackSessionEnd() {
  if (typeof sessionStorage === 'undefined') return
  
  const sessionStart = sessionStorage.getItem('session_start')
  if (!sessionStart) return
  
  const duration = Math.floor((Date.now() - parseInt(sessionStart)) / 1000) // seconds
  
  track('session_end', {
    session_duration: duration,
  })
}

// Track page view with context
export function trackPageView(pagePath: string, pageTitle: string) {
  track('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
    device_type: getDeviceType(),
    referrer_domain: getReferrerDomain(),
  })
}

// Setup session tracking
export function setupSessionTracking() {
  if (typeof window === 'undefined') return
  
  // Track session start
  trackSessionStart()
  
  // Track session end on page unload
  window.addEventListener('beforeunload', trackSessionEnd)
  
  // Track visibility changes (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      track('page_hidden', {
        device_type: getDeviceType(),
      })
    } else {
      track('page_visible', {
        device_type: getDeviceType(),
      })
    }
  })
}
