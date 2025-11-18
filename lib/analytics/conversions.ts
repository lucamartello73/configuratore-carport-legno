import { track } from '@vercel/analytics'

// Conversion events per Vercel Analytics Pro
export type ConversionGoal = 
  | 'quote_request'
  | 'configuration_complete'
  | 'email_signup'
  | 'phone_click'
  | 'admin_action'

export interface ConversionData {
  goal: ConversionGoal
  value?: number
  currency?: string
  items?: string[]
  category?: string
  label?: string
}

// Track conversion with revenue (for Pro plan)
export function trackConversion(data: ConversionData) {
  const eventData: Record<string, any> = {
    goal: data.goal,
    category: data.category || 'general',
  }
  
  if (data.value !== undefined) {
    eventData.value = data.value
  }
  
  if (data.currency) {
    eventData.currency = data.currency
  }
  
  if (data.items) {
    eventData.items = data.items.join(',')
  }
  
  if (data.label) {
    eventData.label = data.label
  }
  
  track('conversion', eventData)
}

// Specific conversion trackers

export function trackQuoteRequestConversion(
  configuratorType: 'FERRO' | 'LEGNO',
  estimatedValue?: number
) {
  trackConversion({
    goal: 'quote_request',
    value: estimatedValue,
    currency: 'EUR',
    category: 'lead_generation',
    label: configuratorType,
  })
}

export function trackConfigurationCompleteConversion(
  configuratorType: 'FERRO' | 'LEGNO',
  selectedItems: string[]
) {
  trackConversion({
    goal: 'configuration_complete',
    category: 'engagement',
    label: configuratorType,
    items: selectedItems,
  })
}

export function trackEmailSignup(source: string) {
  trackConversion({
    goal: 'email_signup',
    category: 'lead_generation',
    label: source,
  })
}

export function trackPhoneClick(source: string) {
  trackConversion({
    goal: 'phone_click',
    category: 'lead_generation',
    label: source,
  })
}

// Funnel tracking
export interface FunnelStep {
  step: number
  name: string
  completed: boolean
  timestamp: number
}

export class FunnelTracker {
  private funnelName: string
  private steps: FunnelStep[] = []
  
  constructor(funnelName: string) {
    this.funnelName = funnelName
  }
  
  trackStep(step: number, name: string) {
    const funnelStep: FunnelStep = {
      step,
      name,
      completed: true,
      timestamp: Date.now(),
    }
    
    this.steps.push(funnelStep)
    
    track('funnel_step', {
      funnel_name: this.funnelName,
      step_number: step,
      step_name: name,
      total_steps: this.steps.length,
    })
  }
  
  trackDropOff(step: number, name: string, reason?: string) {
    track('funnel_drop_off', {
      funnel_name: this.funnelName,
      step_number: step,
      step_name: name,
      reason: reason || 'unknown',
      completed_steps: this.steps.length,
    })
  }
  
  trackCompletion() {
    const duration = this.steps.length > 0 
      ? Date.now() - this.steps[0].timestamp 
      : 0
    
    track('funnel_complete', {
      funnel_name: this.funnelName,
      total_steps: this.steps.length,
      duration_seconds: Math.floor(duration / 1000),
    })
  }
}

// Create configurator funnel tracker
export function createConfiguratorFunnel(type: 'FERRO' | 'LEGNO'): FunnelTracker {
  return new FunnelTracker(`configurator_${type.toLowerCase()}`)
}
