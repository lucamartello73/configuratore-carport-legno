'use client'

import { createClient } from '@/lib/supabase/client'
import { track } from '@vercel/analytics'
import { useEffect } from 'react'

// Session management
let trackingId: string | null = null
let startTime: number = Date.now()

const STORAGE_KEY_SESSION = 'carport_legno_session_id'
const STORAGE_KEY_TRACKING = 'carport_legno_tracking_id'
const STORAGE_KEY_UTM = 'carport_legno_utm_params'
const TABLE_NAME = 'carport_legno_configurazioni_tracking'

// Session ID management
function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem(STORAGE_KEY_SESSION)
  
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(STORAGE_KEY_SESSION, sessionId)
  }
  
  return sessionId
}

function getTrackingId(): string | null {
  if (typeof window === 'undefined') return null
  if (trackingId) return trackingId
  return localStorage.getItem(STORAGE_KEY_TRACKING)
}

function setTrackingId(id: string) {
  if (typeof window === 'undefined') return
  trackingId = id
  localStorage.setItem(STORAGE_KEY_TRACKING, id)
}

function clearTrackingId() {
  if (typeof window === 'undefined') return
  trackingId = null
  localStorage.removeItem(STORAGE_KEY_TRACKING)
}

// UTM parameters
export function getUTMParameters() {
  if (typeof window === 'undefined') return {}
  
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
  }
}

export function saveUTMParameters() {
  if (typeof window === 'undefined') return
  
  const utmParams = getUTMParameters()
  if (Object.values(utmParams).some(v => v !== null)) {
    localStorage.setItem(STORAGE_KEY_UTM, JSON.stringify(utmParams))
  }
}

function getSavedUTMParameters() {
  if (typeof window === 'undefined') return {}
  
  const saved = localStorage.getItem(STORAGE_KEY_UTM)
  return saved ? JSON.parse(saved) : {}
}

// Device detection
export function getDeviceInfo() {
  if (typeof window === 'undefined') {
    return {
      device_type: 'unknown',
      browser: 'unknown',
      os: 'unknown',
      screen_width: 0,
      screen_height: 0,
    }
  }
  
  const ua = navigator.userAgent
  
  let deviceType = 'desktop'
  if (/mobile/i.test(ua)) deviceType = 'mobile'
  else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet'
  
  let browser = 'unknown'
  if (ua.includes('Chrome')) browser = 'chrome'
  else if (ua.includes('Safari')) browser = 'safari'
  else if (ua.includes('Firefox')) browser = 'firefox'
  else if (ua.includes('Edge')) browser = 'edge'
  
  let os = 'unknown'
  if (ua.includes('Windows')) os = 'windows'
  else if (ua.includes('Mac')) os = 'macos'
  else if (ua.includes('Linux')) os = 'linux'
  else if (ua.includes('Android')) os = 'android'
  else if (ua.includes('iOS')) os = 'ios'
  
  return {
    device_type: deviceType,
    browser,
    os,
    screen_width: window.screen.width,
    screen_height: window.screen.height,
  }
}

// Browser fingerprint
export function getBrowserFingerprint(): string {
  if (typeof window === 'undefined') return 'server'
  
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillText('fingerprint', 2, 2)
    }
    const canvasData = canvas.toDataURL()
    
    const fingerprint = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}-${canvasData.slice(0, 50)}`
    
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    
    return hash.toString(36)
  } catch (error) {
    return 'error-' + Math.random().toString(36).substr(2, 9)
  }
}

// Main tracking functions
export async function startConfigurationTracking() {
  if (typeof window === 'undefined') return null
  
  try {
    saveUTMParameters()
    const sessionId = getOrCreateSessionId()
    const supabase = createClient()
    
    const utmParams = getSavedUTMParameters()
    const deviceInfo = getDeviceInfo()
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        session_id: sessionId,
        user_fingerprint: getBrowserFingerprint(),
        referrer: document.referrer || null,
        landing_page: window.location.pathname,
        ...utmParams,
        ...deviceInfo,
        step_reached: 1,
        status: 'in_progress',
      })
      .select('id')
      .single()
    
    if (error) {
      console.error('Error starting tracking:', error)
      return null
    }
    
    setTrackingId(data.id)
    startTime = Date.now()
    
    // Track con Vercel Analytics
    track('configuration_started', {
      device: deviceInfo.device_type,
      utm_campaign: utmParams.utm_campaign || 'direct',
    })
    
    return data.id
  } catch (error) {
    console.error('Error starting tracking:', error)
    return null
  }
}

export async function updateConfigurationTracking(data: {
  step_reached?: number
  tipo_struttura?: string
  modello_id?: string
  modello_nome?: string
  dimensioni_lunghezza?: number
  dimensioni_larghezza?: number
  copertura_id?: string
  copertura_nome?: string
  colore_struttura_id?: string
  colore_struttura_nome?: string
  colore_copertura_id?: string
  colore_copertura_nome?: string
  pavimentazione_id?: string
  pavimentazione_nome?: string
  pacchetto_id?: string
  pacchetto_nome?: string
  accessori?: any[]
  prezzo_base?: number
  prezzo_totale?: number
  configurazione_data?: any
  [key: string]: any
}) {
  if (typeof window === 'undefined') return
  
  let currentTrackingId = getTrackingId()
  
  if (!currentTrackingId) {
    currentTrackingId = await startConfigurationTracking()
    if (!currentTrackingId) return
  }
  
  try {
    const supabase = createClient()
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    await supabase
      .from(TABLE_NAME)
      .update({
        ...data,
        time_spent_seconds: timeSpent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', currentTrackingId)
    
    // Track step completion con Vercel Analytics
    if (data.step_reached) {
      track('step_completed', {
        step: data.step_reached,
        time_spent: timeSpent,
      })
    }
  } catch (error) {
    console.error('Error updating tracking:', error)
  }
}

export async function completeConfigurationTracking(clientData: {
  cliente_nome?: string
  cliente_email?: string
  cliente_telefono?: string
  cliente_citta?: string
  cliente_cap?: string
  cliente_indirizzo?: string
  cliente_note?: string
  [key: string]: any
}) {
  if (typeof window === 'undefined') return
  
  const currentTrackingId = getTrackingId()
  if (!currentTrackingId) return
  
  try {
    const supabase = createClient()
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    await supabase
      .from(TABLE_NAME)
      .update({
        ...clientData,
        status: 'completed',
        completed_at: new Date().toISOString(),
        time_spent_seconds: timeSpent,
      })
      .eq('id', currentTrackingId)
    
    // Track completion con Vercel Analytics
    track('configuration_completed', {
      time_spent: timeSpent,
    })
    
    // Clear session
    clearTrackingId()
  } catch (error) {
    console.error('Error completing tracking:', error)
  }
}

export async function abandonConfigurationTracking() {
  if (typeof window === 'undefined') return
  
  const currentTrackingId = getTrackingId()
  if (!currentTrackingId) return
  
  try {
    const supabase = createClient()
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    await supabase
      .from(TABLE_NAME)
      .update({
        status: 'abandoned',
        time_spent_seconds: timeSpent,
      })
      .eq('id', currentTrackingId)
    
    // Track abandonment con Vercel Analytics
    track('configuration_abandoned', {
      time_spent: timeSpent,
    })
  } catch (error) {
    console.error('Error abandoning tracking:', error)
  }
}

// Hook per auto-tracking abandonment su page unload
export function useConfigurationTracking() {
  if (typeof window === 'undefined') return
  
  useEffect(() => {
    const handleBeforeUnload = () => {
      abandonConfigurationTracking()
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
}

// Helper per tracciare selezioni specifiche
export function trackSelection(type: string, value: string, extra?: any) {
  track('selection_made', {
    selection_type: type,
    value,
    ...extra,
  })
}
