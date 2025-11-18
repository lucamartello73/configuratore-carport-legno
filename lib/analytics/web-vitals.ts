import { onCLS, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals'
import { track } from '@vercel/analytics'

// Web Vitals tracking per Vercel Analytics Pro
export function reportWebVitals() {
  // Core Web Vitals
  onCLS(sendToAnalytics)
  onLCP(sendToAnalytics)
  onINP(sendToAnalytics)
  
  // Additional metrics
  onFCP(sendToAnalytics)
  onTTFB(sendToAnalytics)
}

function sendToAnalytics(metric: Metric) {
  // Send to Vercel Analytics with detailed properties
  track('web_vital', {
    metric_name: metric.name,
    metric_value: metric.value,
    metric_rating: metric.rating,
    metric_delta: metric.delta,
    metric_id: metric.id,
  })
  
  // Log for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('[Web Vitals]', metric.name, metric.value, metric.rating)
  }
}

// Track page performance
export function trackPagePerformance() {
  if (typeof window === 'undefined') return
  
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      track('page_performance', {
        dns_time: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp_time: navigation.connectEnd - navigation.connectStart,
        request_time: navigation.responseEnd - navigation.requestStart,
        dom_load_time: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        total_load_time: navigation.loadEventEnd - navigation.loadEventStart,
      })
    }
  })
}
