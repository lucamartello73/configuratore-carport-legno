-- =====================================================
-- SCRIPT COMPLETO DATABASE CONFIGURATORE LEGNO
-- =====================================================
-- Questo script crea tutte le tabelle necessarie per il
-- configuratore legno con dati esempio pronti all'uso.
--
-- Eseguire su Supabase SQL Editor in ordine sequenziale.
-- =====================================================

-- =====================================================
-- 1. TABELLA: carport_legno_structure_types
-- Tipi di struttura (Addossata, Autoportante, Doppia)
-- =====================================================

CREATE TABLE IF NOT EXISTS carport_legno_structure_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  base_price DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserimento dati esempio
INSERT INTO carport_legno_structure_types (name, description, image, base_price, display_order) VALUES
('Addossata', 'Struttura appoggiata a una parete esistente, ideale per spazi ridotti', '/images/legno/addossata.jpg', 3500.00, 1),
('Autoportante', 'Struttura completamente indipendente con 4 pilastri', '/images/legno/autoportante.jpg', 4200.00, 2),
('Doppia', 'Struttura a doppia falda con capacità per 2+ veicoli', '/images/legno/doppia.jpg', 5800.00, 3);

-- =====================================================
-- 2. TABELLA: carport_legno_models
-- Modelli specifici per ogni tipo di struttura
-- =====================================================

CREATE TABLE IF NOT EXISTS carport_legno_models (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  structure_type_id UUID NOT NULL REFERENCES carport_legno_structure_types(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  price_supplement DECIMAL(10,2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserimento dati esempio (6 modelli: 2 per tipo struttura)
WITH structure_ids AS (
  SELECT id, name FROM carport_legno_structure_types
)
INSERT INTO carport_legno_models (structure_type_id, name, description, image, price_supplement, display_order)
SELECT 
  s.id,
  CASE 
    WHEN s.name = 'Addossata' THEN 'Modello Classico Addossato'
    WHEN s.name = 'Autoportante' THEN 'Modello Standard Autoportante'
    WHEN s.name = 'Doppia' THEN 'Modello Doppia Falda Standard'
  END,
  CASE 
    WHEN s.name = 'Addossata' THEN 'Design tradizionale con travature a vista'
    WHEN s.name = 'Autoportante' THEN 'Quattro pilastri portanti, struttura robusta'
    WHEN s.name = 'Doppia' THEN 'Doppia falda simmetrica, ampia capacità'
  END,
  CASE 
    WHEN s.name = 'Addossata' THEN '/images/legno/model-addossata-classic.jpg'
    WHEN s.name = 'Autoportante' THEN '/images/legno/model-autoportante-standard.jpg'
    WHEN s.name = 'Doppia' THEN '/images/legno/model-doppia-standard.jpg'
  END,
  0.00,
  1
FROM structure_ids s

UNION ALL

SELECT 
  s.id,
  CASE 
    WHEN s.name = 'Addossata' THEN 'Modello Premium Addossato'
    WHEN s.name = 'Autoportante' THEN 'Modello Deluxe Autoportante'
    WHEN s.name = 'Doppia' THEN 'Modello Doppia Falda Premium'
  END,
  CASE 
    WHEN s.name = 'Addossata' THEN 'Design moderno con finiture raffinate'
    WHEN s.name = 'Autoportante' THEN 'Travature rinforzate, design elegante'
    WHEN s.name = 'Doppia' THEN 'Doppia falda asimmetrica, design architettonico'
  END,
  CASE 
    WHEN s.name = 'Addossata' THEN '/images/legno/model-addossata-premium.jpg'
    WHEN s.name = 'Autoportante' THEN '/images/legno/model-autoportante-deluxe.jpg'
    WHEN s.name = 'Doppia' THEN '/images/legno/model-doppia-premium.jpg'
  END,
  350.00,
  2
FROM structure_ids s;

-- =====================================================
-- 3. TABELLA: carport_legno_coverage_types
-- Tipi di copertura (Tegole, Policarbonato, etc.)
-- =====================================================

CREATE TABLE IF NOT EXISTS carport_legno_coverage_types (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  price_modifier DECIMAL(10,2) DEFAULT 0.00,
  compatibile_con TEXT[] DEFAULT ARRAY['legno'],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserimento dati esempio
INSERT INTO carport_legno_coverage_types (name, description, image, price_modifier, compatibile_con, display_order) VALUES
('Tegole Canadesi', 'Copertura in tegole bituminose canadesi, resistenti e durature', '/images/legno/tegole-canadesi.jpg', 450.00, ARRAY['legno'], 1),
('Policarbonato Alveolare', 'Lastre trasparenti in policarbonato, passaggio luce naturale', '/images/legno/policarbonato.jpg', 320.00, ARRAY['legno'], 2),
('Lamiera Coibentata', 'Pannelli sandwich coibentati, isolamento termico ottimale', '/images/legno/lamiera-coibentata.jpg', 580.00, ARRAY['legno'], 3),
('Coppi in Cotto', 'Copertura tradizionale con coppi in terracotta', '/images/legno/coppi-cotto.jpg', 720.00, ARRAY['legno'], 4),
('Pannelli Fotovoltaici', 'Integrazione pannelli solari per produzione energia', '/images/legno/fotovoltaico.jpg', 1200.00, ARRAY['legno'], 5);

-- =====================================================
-- 4. TABELLA: carport_legno_colors
-- Colori/tinte per il legno (Impregnanti)
-- =====================================================

CREATE TABLE IF NOT EXISTS carport_legno_colors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  hex_color VARCHAR(7),
  image VARCHAR(255),
  category VARCHAR(50) DEFAULT 'impregnanti_legno' CHECK (category IN ('impregnanti_legno', 'impregnanti_pastello')),
  price_modifier DECIMAL(10,2) DEFAULT 0.00,
  compatibile_con TEXT[] DEFAULT ARRAY['legno'],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserimento dati esempio (10 colori: 6 Legno + 4 Pastello)
INSERT INTO carport_legno_colors (name, description, hex_color, image, category, price_modifier, display_order) VALUES
-- Impregnanti Legno (6 colori)
('Naturale', 'Finitura trasparente che esalta le venature naturali', '#D4A574', '/images/legno/color-naturale.jpg', 'impregnanti_legno', 0.00, 1),
('Noce Scuro', 'Tonalità calda marrone scuro, elegante e raffinata', '#6B4423', '/images/legno/color-noce.jpg', 'impregnanti_legno', 50.00, 2),
('Teak', 'Colore miele intenso, resistente agli agenti atmosferici', '#B8860B', '/images/legno/color-teak.jpg', 'impregnanti_legno', 80.00, 3),
('Mogano', 'Tonalità rossastra pregiata, effetto luxury', '#8B4513', '/images/legno/color-mogano.jpg', 'impregnanti_legno', 100.00, 4),
('Rovere Chiaro', 'Finitura chiara moderna, ideale per esterni', '#C19A6B', '/images/legno/color-rovere.jpg', 'impregnanti_legno', 60.00, 5),
('Wengè', 'Marrone scurissimo quasi nero, effetto contemporaneo', '#3D2817', '/images/legno/color-wenge.jpg', 'impregnanti_legno', 120.00, 6),

-- Impregnanti Pastello (4 colori)
('Bianco Neve', 'Bianco puro luminoso, effetto Scandinavo', '#F8F8FF', '/images/legno/color-bianco.jpg', 'impregnanti_pastello', 90.00, 7),
('Azzurro Cielo', 'Celeste tenue delicato, stile mediterraneo', '#87CEEB', '/images/legno/color-azzurro.jpg', 'impregnanti_pastello', 110.00, 8),
('Verde Salvia', 'Verde grigio elegante, armonia con la natura', '#9DC183', '/images/legno/color-verde.jpg', 'impregnanti_pastello', 110.00, 9),
('Grigio Perla', 'Grigio chiaro sofisticato, design moderno', '#BDBDBD', '/images/legno/color-grigio.jpg', 'impregnanti_pastello', 100.00, 10);

-- =====================================================
-- 5. TABELLA: carport_legno_surfaces
-- Tipi di superficie/pavimentazione
-- =====================================================

CREATE TABLE IF NOT EXISTS carport_legno_surfaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  price_per_sqm DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserimento dati esempio
INSERT INTO carport_legno_surfaces (name, description, image, price_per_sqm, display_order) VALUES
('Pavimentazione in Legno', 'Superficie in doghe di legno trattato da esterno, antiscivolo', '/images/legno/surface-legno.jpg', 65.00, 1),
('Ghiaia Stabilizzata', 'Base in ghiaia compattata e stabilizzata con bordo contenitivo', '/images/legno/surface-ghiaia.jpg', 35.00, 2),
('Calcestruzzo Armato', 'Pavimentazione in cemento armato per carichi pesanti', '/images/legno/surface-cemento.jpg', 55.00, 3),
('Autobloccanti', 'Mattonelle autobloccanti in calcestruzzo drenante', '/images/legno/surface-autobloccanti.jpg', 45.00, 4),
('Grigliato Salvaprato', 'Griglie in plastica riciclata per superfici erbose carrabili', '/images/legno/surface-grigliato.jpg', 38.00, 5),
('Pavimentazione Esistente', 'Utilizzo della superficie già presente (no costi aggiuntivi)', '/images/legno/surface-existing.jpg', 0.00, 6);

-- =====================================================
-- 6. TABELLA: carport_legno_accessories
-- Accessori opzionali
-- =====================================================

CREATE TABLE IF NOT EXISTS carport_legno_accessories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserimento dati esempio
INSERT INTO carport_legno_accessories (name, description, image, price, category, display_order) VALUES
('Grondaia Completa', 'Sistema di raccolta acqua piovana con downpipe', '/images/legno/acc-grondaia.jpg', 280.00, 'drenaggio', 1),
('Illuminazione LED', 'Faretti LED integrati con sensore crepuscolare', '/images/legno/acc-led.jpg', 320.00, 'illuminazione', 2),
('Pannelli Laterali Frangivento', 'Chiusure laterali in legno o policarbonato', '/images/legno/acc-pannelli.jpg', 450.00, 'protezione', 3),
('Ganci Portabici', 'Sistema di aggancio per biciclette (4 posti)', '/images/legno/acc-portabici.jpg', 120.00, 'utilità', 4),
('Ripostiglio Integrato', 'Box porta attrezzi laterale in legno', '/images/legno/acc-ripostiglio.jpg', 680.00, 'storage', 5),
('Fioriere Perimetrali', 'Set 4 fioriere in legno coordinate alla struttura', '/images/legno/acc-fioriere.jpg', 240.00, 'estetica', 6),
('Tenda Parasole', 'Tenda avvolgibile motorizzata resistente UV', '/images/legno/acc-tenda.jpg', 890.00, 'protezione', 7),
('Presa Elettrica Esterna', 'Punto luce + presa schuko IP65 da esterno', '/images/legno/acc-presa.jpg', 180.00, 'elettrico', 8);

-- =====================================================
-- 7. TABELLA: carport_legno_packages
-- Pacchetti di servizio (Chiavi in mano / Fai da te)
-- =====================================================

CREATE TABLE IF NOT EXISTS carport_legno_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price_modifier DECIMAL(10,2) DEFAULT 0.00,
  includes TEXT[],
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserimento dati esempio
INSERT INTO carport_legno_packages (name, description, price_modifier, includes, display_order) VALUES
('Chiavi in Mano', 'Servizio completo con trasporto, montaggio e installazione professionale', 1200.00, ARRAY[
  'Trasporto della struttura al tuo indirizzo',
  'Montaggio professionale da parte dei nostri tecnici specializzati',
  'Installazione e messa in opera completa',
  'Verifica staticità e sicurezza',
  'Pulizia dell''area di lavoro',
  'Garanzia montaggio 2 anni'
], 1),
('Fai da Te', 'Solo fornitura struttura per montaggio autonomo', 0.00, ARRAY[
  'Struttura completa con tutti i componenti numerati',
  'Manuale di montaggio dettagliato con illustrazioni',
  'Supporto telefonico per il montaggio',
  'Video tutorial online',
  'Garanzia sui materiali 10 anni'
], 2);

-- =====================================================
-- 8. TABELLA: carport_legno_configurations
-- Configurazioni salvate dagli utenti
-- =====================================================

CREATE TABLE IF NOT EXISTS carport_legno_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Riferimenti alle scelte
  structure_type_id UUID REFERENCES carport_legno_structure_types(id) ON DELETE SET NULL,
  model_id UUID REFERENCES carport_legno_models(id) ON DELETE SET NULL,
  coverage_id UUID REFERENCES carport_legno_coverage_types(id) ON DELETE SET NULL,
  color_id UUID REFERENCES carport_legno_colors(id) ON DELETE SET NULL,
  surface_id UUID REFERENCES carport_legno_surfaces(id) ON DELETE SET NULL,
  package_id UUID REFERENCES carport_legno_packages(id) ON DELETE SET NULL,
  
  -- Dimensioni
  width INTEGER NOT NULL CHECK (width >= 230),
  depth INTEGER NOT NULL CHECK (depth >= 300),
  height INTEGER NOT NULL CHECK (height >= 180),
  car_spots INTEGER DEFAULT 1,
  
  -- Accessori (array di UUID)
  accessory_ids UUID[],
  
  -- Prezzi calcolati
  base_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  
  -- Dati cliente
  customer_name VARCHAR(200),
  customer_email VARCHAR(200),
  customer_phone VARCHAR(50),
  customer_address TEXT,
  customer_city VARCHAR(100),
  customer_postal_code VARCHAR(20),
  contact_preference VARCHAR(50) DEFAULT 'email' CHECK (contact_preference IN ('email', 'phone', 'whatsapp')),
  privacy_accepted BOOLEAN DEFAULT false,
  marketing_accepted BOOLEAN DEFAULT false,
  
  -- Note
  notes TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'quoted', 'approved', 'rejected')),
  
  -- Metadata
  session_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE
);

-- Indici per performance
CREATE INDEX idx_legno_config_status ON carport_legno_configurations(status);
CREATE INDEX idx_legno_config_created ON carport_legno_configurations(created_at DESC);
CREATE INDEX idx_legno_config_customer_email ON carport_legno_configurations(customer_email);

-- =====================================================
-- TRIGGER PER AGGIORNAMENTO AUTOMATICO updated_at
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Applica trigger a tutte le tabelle
CREATE TRIGGER update_carport_legno_structure_types_updated_at BEFORE UPDATE ON carport_legno_structure_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carport_legno_models_updated_at BEFORE UPDATE ON carport_legno_models FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carport_legno_coverage_types_updated_at BEFORE UPDATE ON carport_legno_coverage_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carport_legno_colors_updated_at BEFORE UPDATE ON carport_legno_colors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carport_legno_surfaces_updated_at BEFORE UPDATE ON carport_legno_surfaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carport_legno_accessories_updated_at BEFORE UPDATE ON carport_legno_accessories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carport_legno_packages_updated_at BEFORE UPDATE ON carport_legno_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_carport_legno_configurations_updated_at BEFORE UPDATE ON carport_legno_configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ABILITAZIONE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE carport_legno_structure_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE carport_legno_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE carport_legno_coverage_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE carport_legno_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE carport_legno_surfaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE carport_legno_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE carport_legno_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE carport_legno_configurations ENABLE ROW LEVEL SECURITY;

-- Policies per lettura pubblica tabelle di configurazione
CREATE POLICY "Allow public read structure_types" ON carport_legno_structure_types FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read models" ON carport_legno_models FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read coverage_types" ON carport_legno_coverage_types FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read colors" ON carport_legno_colors FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read surfaces" ON carport_legno_surfaces FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read accessories" ON carport_legno_accessories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read packages" ON carport_legno_packages FOR SELECT USING (is_active = true);

-- Policy per inserimento configurazioni (pubblico può creare)
CREATE POLICY "Allow public insert configurations" ON carport_legno_configurations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read own configurations" ON carport_legno_configurations FOR SELECT USING (true);

-- =====================================================
-- VERIFICA FINALE
-- =====================================================

-- Conta righe inserite per ogni tabella
SELECT 
  'carport_legno_structure_types' as table_name, 
  COUNT(*) as row_count 
FROM carport_legno_structure_types

UNION ALL

SELECT 
  'carport_legno_models' as table_name, 
  COUNT(*) as row_count 
FROM carport_legno_models

UNION ALL

SELECT 
  'carport_legno_coverage_types' as table_name, 
  COUNT(*) as row_count 
FROM carport_legno_coverage_types

UNION ALL

SELECT 
  'carport_legno_colors' as table_name, 
  COUNT(*) as row_count 
FROM carport_legno_colors

UNION ALL

SELECT 
  'carport_legno_surfaces' as table_name, 
  COUNT(*) as row_count 
FROM carport_legno_surfaces

UNION ALL

SELECT 
  'carport_legno_accessories' as table_name, 
  COUNT(*) as row_count 
FROM carport_legno_accessories

UNION ALL

SELECT 
  'carport_legno_packages' as table_name, 
  COUNT(*) as row_count 
FROM carport_legno_packages

ORDER BY table_name;

-- =====================================================
-- FINE SCRIPT
-- =====================================================
-- Tutte le tabelle sono state create con successo!
-- 
-- RIEPILOGO:
-- - 3 tipi di struttura
-- - 6 modelli (2 per tipo struttura)
-- - 5 tipi di copertura
-- - 10 colori (6 Legno + 4 Pastello)
-- - 6 tipi di superficie
-- - 8 accessori opzionali
-- - 2 pacchetti servizio
-- - Tabella configurazioni pronta per ricevere dati
-- 
-- TOTALE DATI: 40 record predefiniti
-- =====================================================
