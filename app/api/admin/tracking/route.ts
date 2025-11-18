import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const TABLE_NAME = 'carport_legno_configurazioni_tracking'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '7d'
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    
    switch (timeframe) {
      case '24h':
        startDate.setHours(now.getHours() - 24)
        break
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      default:
        startDate.setDate(now.getDate() - 7)
    }
    
    // Build query
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (status) {
      query = query.eq('status', status)
    }
    
    const { data: configurations, error } = await query
    
    if (error) {
      console.error('Error fetching tracking data:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Calculate analytics
    const total = configurations.length
    const completed = configurations.filter(c => c.status === 'completed').length
    const abandoned = configurations.filter(c => c.status === 'abandoned').length
    const inProgress = configurations.filter(c => c.status === 'in_progress').length
    
    const conversionRate = total > 0 ? ((completed / total) * 100).toFixed(2) : '0.00'
    
    // Step distribution (funnel)
    const stepDistribution: Record<number, number> = {}
    for (let i = 1; i <= 7; i++) {
      stepDistribution[i] = configurations.filter(c => c.step_reached >= i).length
    }
    
    // Device breakdown
    const deviceBreakdown = {
      mobile: configurations.filter(c => c.device_type === 'mobile').length,
      desktop: configurations.filter(c => c.device_type === 'desktop').length,
      tablet: configurations.filter(c => c.device_type === 'tablet').length,
    }
    
    // Top selections
    const modelCounts: Record<string, number> = {}
    const coverageCounts: Record<string, number> = {}
    const colorCounts: Record<string, number> = {}
    
    configurations.forEach(c => {
      if (c.modello_nome) {
        modelCounts[c.modello_nome] = (modelCounts[c.modello_nome] || 0) + 1
      }
      if (c.copertura_nome) {
        coverageCounts[c.copertura_nome] = (coverageCounts[c.copertura_nome] || 0) + 1
      }
      if (c.colore_struttura_nome) {
        colorCounts[c.colore_struttura_nome] = (colorCounts[c.colore_struttura_nome] || 0) + 1
      }
    })
    
    const topModels = Object.entries(modelCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
    
    const topCoverages = Object.entries(coverageCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
    
    const topColors = Object.entries(colorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
    
    // Average time spent
    const completedConfigs = configurations.filter(c => c.time_spent_seconds && c.time_spent_seconds > 0)
    const avgTimeSpent = completedConfigs.length > 0
      ? Math.round(completedConfigs.reduce((sum, c) => sum + (c.time_spent_seconds || 0), 0) / completedConfigs.length)
      : 0
    
    // UTM sources
    const utmSources: Record<string, number> = {}
    configurations.forEach(c => {
      const source = c.utm_source || c.utm_campaign || 'direct'
      utmSources[source] = (utmSources[source] || 0) + 1
    })
    
    const topSources = Object.entries(utmSources)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }))
    
    return NextResponse.json({
      success: true,
      data: {
        summary: {
          total,
          completed,
          abandoned,
          inProgress,
          conversionRate: parseFloat(conversionRate),
          avgTimeSpent,
        },
        stepDistribution,
        deviceBreakdown,
        topSelections: {
          models: topModels,
          coverages: topCoverages,
          colors: topColors,
        },
        topSources,
        recentConfigurations: configurations.slice(0, 20),
      },
    })
  } catch (error) {
    console.error('Error in tracking API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
