-- Tabella tracking configurazioni carport LEGNO
CREATE TABLE IF NOT EXISTS carport_legno_configurazioni_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_fingerprint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- UTM tracking
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer TEXT,
  landing_page TEXT,
  
  -- Device info
  device_type TEXT,
  browser TEXT,
  os TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  
  -- Progress tracking
  step_reached INTEGER DEFAULT 1,
  
  -- Configurazione carport LEGNO
  tipo_struttura TEXT, -- 'addossato' o 'autoportante'
  modello_id TEXT,
  modello_nome TEXT,
  dimensioni_lunghezza DECIMAL(10,2),
  dimensioni_larghezza DECIMAL(10,2),
  copertura_id TEXT,
  copertura_nome TEXT,
  colore_struttura_id TEXT,
  colore_struttura_nome TEXT,
  colore_copertura_id TEXT,
  colore_copertura_nome TEXT,
  pavimentazione_id TEXT,
  pavimentazione_nome TEXT,
  pacchetto_id TEXT,
  pacchetto_nome TEXT,
  accessori JSONB DEFAULT '[]'::jsonb,
  prezzo_base DECIMAL(10,2),
  prezzo_totale DECIMAL(10,2),
  
  -- Dati completi configurazione
  configurazione_data JSONB,
  
  -- Client data (se form completato)
  cliente_nome TEXT,
  cliente_email TEXT,
  cliente_telefono TEXT,
  cliente_citta TEXT,
  cliente_cap TEXT,
  cliente_indirizzo TEXT,
  cliente_note TEXT,
  
  -- Status
  status TEXT DEFAULT 'in_progress', -- 'in_progress', 'completed', 'abandoned'
  time_spent_seconds INTEGER,
  
  -- Campagna collegata
  campagna_id UUID,
  
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indici per performance
CREATE INDEX IF NOT EXISTS idx_legno_config_session ON carport_legno_configurazioni_tracking(session_id);
CREATE INDEX IF NOT EXISTS idx_legno_config_created ON carport_legno_configurazioni_tracking(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_legno_config_status ON carport_legno_configurazioni_tracking(status);
CREATE INDEX IF NOT EXISTS idx_legno_config_step ON carport_legno_configurazioni_tracking(step_reached);
CREATE INDEX IF NOT EXISTS idx_legno_config_utm_campaign ON carport_legno_configurazioni_tracking(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_legno_config_campagna ON carport_legno_configurazioni_tracking(campagna_id);

-- Trigger per aggiornare timestamp
CREATE OR REPLACE FUNCTION update_legno_config_tracking_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_legno_config_tracking
  BEFORE UPDATE ON carport_legno_configurazioni_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_legno_config_tracking_timestamp();

-- RLS Policies
ALTER TABLE carport_legno_configurazioni_tracking ENABLE ROW LEVEL SECURITY;

-- Permetti insert anonimo (per tracking utenti non loggati)
CREATE POLICY "Allow anonymous insert" ON carport_legno_configurazioni_tracking
  FOR INSERT WITH CHECK (true);

-- Permetti update della propria sessione
CREATE POLICY "Allow session update" ON carport_legno_configurazioni_tracking
  FOR UPDATE USING (true);

-- Admin può leggere tutto (qualsiasi utente autenticato)
CREATE POLICY "Admin can read all" ON carport_legno_configurazioni_tracking
  FOR SELECT USING (
    auth.uid() IS NOT NULL
  );

-- Tabella campagne marketing
CREATE TABLE IF NOT EXISTS carport_legno_campagne_marketing (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  codice TEXT UNIQUE NOT NULL,
  descrizione TEXT,
  
  -- Dettagli campagna
  piattaforma TEXT, -- 'google', 'meta', 'tiktok', 'youtube', 'linkedin', 'altro'
  tipo_contenuto TEXT, -- 'video', 'foto', 'carousel', 'stories', 'reels'
  target_audience TEXT,
  
  -- Budget e obiettivi
  budget_euro DECIMAL(10,2),
  obiettivo_conversioni INTEGER,
  
  -- Date
  data_inizio DATE,
  data_fine DATE,
  stato TEXT DEFAULT 'attiva', -- 'attiva', 'completata', 'sospesa'
  
  -- UTM parameters
  utm_source TEXT NOT NULL,
  utm_medium TEXT NOT NULL,
  utm_campaign TEXT NOT NULL,
  utm_content TEXT,
  
  -- Metriche piattaforma
  impressions INTEGER DEFAULT 0,
  click INTEGER DEFAULT 0,
  costo_totale DECIMAL(10,2) DEFAULT 0,
  
  -- Metriche calcolate (aggiornate da trigger)
  totale_configurazioni INTEGER DEFAULT 0,
  configurazioni_completate INTEGER DEFAULT 0,
  tasso_conversione DECIMAL(5,2) DEFAULT 0,
  cpa DECIMAL(10,2) DEFAULT 0, -- Cost Per Acquisition
  roi DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_legno_campagne_codice ON carport_legno_campagne_marketing(codice);
CREATE INDEX IF NOT EXISTS idx_legno_campagne_utm ON carport_legno_campagne_marketing(utm_campaign);
CREATE INDEX IF NOT EXISTS idx_legno_campagne_stato ON carport_legno_campagne_marketing(stato);

-- Tabella snapshots storici
CREATE TABLE IF NOT EXISTS carport_legno_tracking_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descrizione TEXT,
  campagna_id UUID REFERENCES carport_legno_campagne_marketing(id),
  
  -- Periodo snapshot
  data_inizio TIMESTAMPTZ NOT NULL,
  data_fine TIMESTAMPTZ NOT NULL,
  
  -- Metriche aggregate
  totale_configurazioni INTEGER,
  completate INTEGER,
  abbandonate INTEGER,
  tasso_conversione DECIMAL(5,2),
  tempo_medio_secondi INTEGER,
  
  -- Distribuzione step (funnel)
  step_distribution JSONB, -- { "step_1": 100, "step_2": 80, ... }
  
  -- Top selections
  top_modelli JSONB,
  top_colori JSONB,
  top_coperture JSONB,
  
  -- Device breakdown
  device_breakdown JSONB, -- { "mobile": 60, "desktop": 35, "tablet": 5 }
  
  -- Referrer sources
  referrer_sources JSONB,
  
  -- Configurazioni archiviate (dataset completo)
  configurazioni_archiviate JSONB,
  
  -- Metriche marketing
  budget_speso DECIMAL(10,2),
  cpa DECIMAL(10,2),
  roi DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_legno_snapshots_campagna ON carport_legno_tracking_snapshots(campagna_id);
CREATE INDEX IF NOT EXISTS idx_legno_snapshots_created ON carport_legno_tracking_snapshots(created_at DESC);

-- RLS per campagne e snapshots (solo admin)
ALTER TABLE carport_legno_campagne_marketing ENABLE ROW LEVEL SECURITY;
ALTER TABLE carport_legno_tracking_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access campagne" ON carport_legno_campagne_marketing
  FOR ALL USING (
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Admin full access snapshots" ON carport_legno_tracking_snapshots
  FOR ALL USING (
    auth.uid() IS NOT NULL
  );

-- Function per calcolare metriche campagna
CREATE OR REPLACE FUNCTION update_campagna_metriche()
RETURNS TRIGGER AS $$
DECLARE
  v_totale INTEGER;
  v_completate INTEGER;
  v_tasso DECIMAL(5,2);
  v_cpa DECIMAL(10,2);
BEGIN
  -- Conta configurazioni per questa campagna
  SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'completed')
  INTO v_totale, v_completate
  FROM carport_legno_configurazioni_tracking
  WHERE campagna_id = NEW.campagna_id;
  
  -- Calcola tasso conversione
  IF v_totale > 0 THEN
    v_tasso := (v_completate::DECIMAL / v_totale::DECIMAL) * 100;
  ELSE
    v_tasso := 0;
  END IF;
  
  -- Calcola CPA (Cost Per Acquisition)
  IF v_completate > 0 THEN
    SELECT costo_totale / v_completate
    INTO v_cpa
    FROM carport_legno_campagne_marketing
    WHERE id = NEW.campagna_id;
  ELSE
    v_cpa := 0;
  END IF;
  
  -- Aggiorna campagna
  UPDATE carport_legno_campagne_marketing
  SET 
    totale_configurazioni = v_totale,
    configurazioni_completate = v_completate,
    tasso_conversione = v_tasso,
    cpa = v_cpa,
    updated_at = NOW()
  WHERE id = NEW.campagna_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per aggiornare metriche campagna quando cambia una configurazione
CREATE TRIGGER trigger_update_campagna_metriche
  AFTER INSERT OR UPDATE ON carport_legno_configurazioni_tracking
  FOR EACH ROW
  WHEN (NEW.campagna_id IS NOT NULL)
  EXECUTE FUNCTION update_campagna_metriche();

-- View per analytics dashboard
CREATE OR REPLACE VIEW carport_legno_analytics_summary AS
SELECT
  DATE_TRUNC('day', created_at) as date,
  COUNT(*) as total_configurations,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE status = 'abandoned') as abandoned,
  COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
  ROUND(AVG(time_spent_seconds)) as avg_time_seconds,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) FILTER (WHERE device_type = 'mobile') as mobile_count,
  COUNT(*) FILTER (WHERE device_type = 'desktop') as desktop_count,
  COUNT(*) FILTER (WHERE device_type = 'tablet') as tablet_count
FROM carport_legno_configurazioni_tracking
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;
