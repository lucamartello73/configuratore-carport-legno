// Configurazione e funzioni di tracking Google Analytics 4 per il configuratore carport
// Gestisce eventi di navigazione, abbandono e conversione

// Costante identificativa del configuratore
export const CONFIGURATOR_NAME = "coperture_auto"

// Interfaccia per i parametri degli eventi
interface EventParams {
  configurator_name: string
  step_name: string
  traffic_source?: string
  traffic_medium?: string
  [key: string]: any
}

// Dichiarazione globale per gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void
    dataLayer: any[]
  }
}

/**
 * Inizializza Google Analytics se non già presente
 */
export function initializeGoogleAnalytics(measurementId = "G-8BW6WP9PR1") {
  if (typeof window === "undefined") return

  if (window.gtag) {
    console.log("[v0] Google Analytics already initialized")
    return
  }

  // Crea il dataLayer se non esiste
  window.dataLayer = window.dataLayer || []

  // Definisce la funzione gtag
  window.gtag = () => {
    window.dataLayer.push(arguments)
  }

  // Configura gtag
  window.gtag("js", new Date())
  window.gtag("config", measurementId)

  console.log("[v0] Google Analytics initialized with ID:", measurementId)
}

/**
 * Estrae i parametri di traffico dall'URL e dal referrer
 */
function getTrafficParams(): { traffic_source?: string; traffic_medium?: string } {
  if (typeof window === "undefined") return {}

  const urlParams = new URLSearchParams(window.location.search)
  const utmSource = urlParams.get("utm_source")
  const utmMedium = urlParams.get("utm_medium")

  // Se non ci sono parametri UTM, usa il referrer
  const referrer = document.referrer
  let trafficSource = utmSource
  let trafficMedium = utmMedium

  if (!trafficSource && referrer) {
    try {
      const referrerDomain = new URL(referrer).hostname
      trafficSource = referrerDomain
      trafficMedium = trafficMedium || "referral"
    } catch (e) {
      // Ignora errori di parsing URL
    }
  }

  return {
    traffic_source: trafficSource || undefined,
    traffic_medium: trafficMedium || undefined,
  }
}

/**
 * Invia evento di navigazione step del configuratore
 */
export function trackConfiguratorStep(stepName: string, additionalParams: Record<string, any> = {}) {
  if (typeof window === "undefined" || !window.gtag) {
    console.log("[v0] Google Analytics not available, skipping step tracking")
    return
  }

  const trafficParams = getTrafficParams()

  const eventParams: EventParams = {
    configurator_name: CONFIGURATOR_NAME,
    step_name: stepName,
    ...trafficParams,
    ...additionalParams,
  }

  console.log("[v0] Tracking configurator step:", stepName, eventParams)

  window.gtag("event", "configurator_step", eventParams)
}

/**
 * Invia evento di invio configurazione completata
 */
export function trackConfiguratorSubmit(additionalParams: Record<string, any> = {}) {
  if (typeof window === "undefined" || !window.gtag) {
    console.log("[v0] Google Analytics not available, skipping submit tracking")
    return
  }

  const trafficParams = getTrafficParams()

  const eventParams: EventParams = {
    configurator_name: CONFIGURATOR_NAME,
    step_name: "form_submit",
    ...trafficParams,
    ...additionalParams,
  }

  console.log("[v0] Tracking configurator submit:", eventParams)

  window.gtag("event", "configurator_form_submit", eventParams)
}

/**
 * Invia evento di abbandono configuratore
 */
export function trackConfiguratorAbandon(currentStep: string, additionalParams: Record<string, any> = {}) {
  if (typeof window === "undefined" || !window.gtag) {
    console.log("[v0] Google Analytics not available, skipping abandon tracking")
    return
  }

  const trafficParams = getTrafficParams()

  const eventParams: EventParams = {
    configurator_name: CONFIGURATOR_NAME,
    step_name: currentStep,
    ...trafficParams,
    ...additionalParams,
  }

  console.log("[v0] Tracking configurator abandon:", currentStep, eventParams)

  window.gtag("event", "configurator_abandon", eventParams)
}

/**
 * Hook per gestire l'abbandono della pagina
 */
export function setupAbandonTracking(getCurrentStep: () => string) {
  if (typeof window === "undefined") return

  const handleBeforeUnload = () => {
    const currentStep = getCurrentStep()
    trackConfiguratorAbandon(currentStep, { abandon_type: "page_unload" })
  }

  const handleVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      const currentStep = getCurrentStep()
      trackConfiguratorAbandon(currentStep, { abandon_type: "tab_hidden" })
    }
  }

  // Ascolta eventi di abbandono
  window.addEventListener("beforeunload", handleBeforeUnload)
  document.addEventListener("visibilitychange", handleVisibilityChange)

  // Funzione di cleanup
  return () => {
    window.removeEventListener("beforeunload", handleBeforeUnload)
    document.removeEventListener("visibilitychange", handleVisibilityChange)
  }
}
