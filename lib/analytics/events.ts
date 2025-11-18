import { track } from '@vercel/analytics'

// Custom event types
export type ConfiguratorEvent =
  | 'configuration_started'
  | 'step_completed'
  | 'configuration_completed'
  | 'quote_requested'
  | 'model_selected'
  | 'structure_type_selected'
  | 'coverage_selected'
  | 'color_selected'
  | 'surface_selected'

export type AdminEvent =
  | 'admin_login'
  | 'model_created'
  | 'model_updated'
  | 'model_deleted'
  | 'structure_type_created'
  | 'structure_type_updated'
  | 'configuration_viewed'
  | 'email_sent'
  | 'user_created'
  | 'pricing_rule_created'

// Track configurator events
export function trackConfiguratorEvent(
  event: ConfiguratorEvent,
  properties?: Record<string, string | number | boolean>
) {
  track(event, properties)
}

// Track admin events
export function trackAdminEvent(
  event: AdminEvent,
  properties?: Record<string, string | number | boolean>
) {
  track(event, properties)
}

// Specific event trackers for common actions

export function trackStepCompleted(step: number, stepName: string) {
  trackConfiguratorEvent('step_completed', {
    step,
    step_name: stepName,
  })
}

export function trackModelSelected(modelId: string, modelName: string) {
  trackConfiguratorEvent('model_selected', {
    model_id: modelId,
    model_name: modelName,
  })
}

export function trackStructureTypeSelected(typeId: string, typeName: string) {
  trackConfiguratorEvent('structure_type_selected', {
    type_id: typeId,
    type_name: typeName,
  })
}

export function trackCoverageSelected(coverageId: string, coverageName: string) {
  trackConfiguratorEvent('coverage_selected', {
    coverage_id: coverageId,
    coverage_name: coverageName,
  })
}

export function trackColorSelected(colorId: string, colorName: string) {
  trackConfiguratorEvent('color_selected', {
    color_id: colorId,
    color_name: colorName,
  })
}

export function trackSurfaceSelected(surfaceId: string, surfaceName: string) {
  trackConfiguratorEvent('surface_selected', {
    surface_id: surfaceId,
    surface_name: surfaceName,
  })
}

export function trackConfigurationStarted(configuratorType: 'FERRO' | 'LEGNO') {
  trackConfiguratorEvent('configuration_started', {
    configurator_type: configuratorType,
  })
}

export function trackConfigurationCompleted(
  configuratorType: 'FERRO' | 'LEGNO',
  totalPrice: number
) {
  trackConfiguratorEvent('configuration_completed', {
    configurator_type: configuratorType,
    total_price: totalPrice,
  })
}

export function trackQuoteRequested(
  customerEmail: string,
  configuratorType: 'FERRO' | 'LEGNO'
) {
  trackConfiguratorEvent('quote_requested', {
    configurator_type: configuratorType,
    has_email: !!customerEmail,
  })
}

export function trackAdminLogin(userEmail: string) {
  trackAdminEvent('admin_login', {
    user_email: userEmail,
  })
}

export function trackEmailSent(recipient: string, subject: string) {
  trackAdminEvent('email_sent', {
    recipient_domain: recipient.split('@')[1] || 'unknown',
    subject_length: subject.length,
  })
}
