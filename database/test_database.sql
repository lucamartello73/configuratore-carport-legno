-- =====================================================
-- QUERY DI TEST DATABASE CONFIGURATORE LEGNO
-- =====================================================
-- Esegui queste query DOPO aver eseguito lo script principale
-- per verificare che tutto sia stato creato correttamente.
-- =====================================================

-- 1. VERIFICA CREAZIONE TABELLE E CONTEGGIO RIGHE
-- Deve mostrare 7 tabelle (esclusa configurations che è vuota)
SELECT 
  'carport_legno_structure_types' as table_name, 
  COUNT(*) as row_count,
  '3 attesi' as expected
FROM carport_legno_structure_types

UNION ALL

SELECT 
  'carport_legno_models' as table_name, 
  COUNT(*) as row_count,
  '6 attesi' as expected
FROM carport_legno_models

UNION ALL

SELECT 
  'carport_legno_coverage_types' as table_name, 
  COUNT(*) as row_count,
  '5 attesi' as expected
FROM carport_legno_coverage_types

UNION ALL

SELECT 
  'carport_legno_colors' as table_name, 
  COUNT(*) as row_count,
  '10 attesi' as expected
FROM carport_legno_colors

UNION ALL

SELECT 
  'carport_legno_surfaces' as table_name, 
  COUNT(*) as row_count,
  '6 attesi' as expected
FROM carport_legno_surfaces

UNION ALL

SELECT 
  'carport_legno_accessories' as table_name, 
  COUNT(*) as row_count,
  '8 attesi' as expected
FROM carport_legno_accessories

UNION ALL

SELECT 
  'carport_legno_packages' as table_name, 
  COUNT(*) as row_count,
  '2 attesi' as expected
FROM carport_legno_packages

ORDER BY table_name;

-- =====================================================

-- 2. VERIFICA TIPI DI STRUTTURA
SELECT 
  name as struttura,
  base_price as prezzo_base,
  is_active as attiva,
  display_order as ordine
FROM carport_legno_structure_types
ORDER BY display_order;

-- =====================================================

-- 3. VERIFICA MODELLI PER TIPO STRUTTURA
SELECT 
  s.name as struttura,
  m.name as modello,
  m.price_supplement as supplemento,
  m.display_order as ordine
FROM carport_legno_models m
JOIN carport_legno_structure_types s ON m.structure_type_id = s.id
ORDER BY s.display_order, m.display_order;

-- =====================================================

-- 4. VERIFICA COLORI PER CATEGORIA
SELECT 
  category as categoria,
  name as colore,
  hex_color as codice_hex,
  price_modifier as supplemento_prezzo,
  display_order as ordine
FROM carport_legno_colors
WHERE is_active = true
ORDER BY category, display_order;

-- =====================================================

-- 5. VERIFICA COLORI - CONTEGGIO PER CATEGORIA
SELECT 
  category as categoria,
  COUNT(*) as numero_colori
FROM carport_legno_colors
GROUP BY category
ORDER BY category;

-- Risultato atteso:
-- impregnanti_legno: 6
-- impregnanti_pastello: 4

-- =====================================================

-- 6. VERIFICA SUPERFICI CON PREZZO AL M²
SELECT 
  name as superficie,
  price_per_sqm as prezzo_al_mq,
  description as descrizione,
  display_order as ordine
FROM carport_legno_surfaces
WHERE is_active = true
ORDER BY display_order;

-- =====================================================

-- 7. VERIFICA ACCESSORI PER CATEGORIA
SELECT 
  category as categoria,
  name as accessorio,
  price as prezzo,
  display_order as ordine
FROM carport_legno_accessories
WHERE is_active = true
ORDER BY category, display_order;

-- =====================================================

-- 8. VERIFICA COPERTURE COMPATIBILI CON LEGNO
SELECT 
  name as copertura,
  price_modifier as supplemento,
  compatibile_con as compatibilita,
  display_order as ordine
FROM carport_legno_coverage_types
WHERE 'legno' = ANY(compatibile_con)
AND is_active = true
ORDER BY display_order;

-- =====================================================

-- 9. VERIFICA FOREIGN KEY E RELAZIONI
-- Deve mostrare 6 modelli correttamente linkati ai 3 tipi struttura
SELECT 
  s.name as struttura,
  COUNT(m.id) as numero_modelli
FROM carport_legno_structure_types s
LEFT JOIN carport_legno_models m ON s.id = m.structure_type_id
GROUP BY s.name
ORDER BY s.name;

-- Risultato atteso: 2 modelli per ogni struttura

-- =====================================================

-- 10. VERIFICA ROW LEVEL SECURITY (RLS)
-- Deve mostrare TRUE per tutte le tabelle
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename LIKE 'carport_legno_%'
ORDER BY tablename;

-- =====================================================

-- 11. VERIFICA POLICIES RLS
-- Deve mostrare le policy per lettura pubblica
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as command,
  qual as using_clause
FROM pg_policies
WHERE schemaname = 'public'
AND tablename LIKE 'carport_legno_%'
ORDER BY tablename, policyname;

-- =====================================================

-- 12. SIMULAZIONE CALCOLO PREZZO TOTALE
-- Esempio configurazione:
-- - Struttura: Addossata (€3.500)
-- - Modello: Premium (+€350)
-- - Dimensioni: 300cm × 500cm = 15 m²
-- - Copertura: Tegole Canadesi (+€450)
-- - Colore: Noce Scuro (+€50)
-- - Superficie: Legno (€65/m² × 15m² = €975)
-- - Accessori: Grondaia (€280) + LED (€320) = €600
-- - Pacchetto: Chiavi in Mano (+€1.200)
-- TOTALE ATTESO: €7.125

WITH config AS (
  SELECT 
    3500.00 as base_price_struttura,
    350.00 as supplemento_modello,
    450.00 as supplemento_copertura,
    50.00 as supplemento_colore,
    (65.00 * 15) as costo_superficie,
    600.00 as costo_accessori,
    1200.00 as supplemento_pacchetto
)
SELECT 
  base_price_struttura + 
  supplemento_modello + 
  supplemento_copertura + 
  supplemento_colore + 
  costo_superficie + 
  costo_accessori + 
  supplemento_pacchetto as prezzo_totale_esempio
FROM config;

-- =====================================================
-- FINE TEST
-- =====================================================
-- Se tutte le query sopra restituiscono i risultati attesi,
-- il database è stato configurato correttamente! ✅
-- =====================================================
