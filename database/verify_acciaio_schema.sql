-- =====================================================
-- VERIFICA SCHEMA DATABASE CONFIGURATORE ACCIAIO
-- =====================================================

-- 1. Verifica tabelle acciaio esistenti
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'carport_acciaio%'
ORDER BY table_name;

-- 2. Verifica structure_types per acciaio
SELECT id, name, description, image_url, compatibile_con
FROM carport_structure_types
WHERE 'acciaio' = ANY(compatibile_con)
ORDER BY name;

-- 3. Verifica product_models per acciaio
SELECT id, name, description, image_url, tipo_struttura_id, compatibile_con
FROM carport_product_models
WHERE 'acciaio' = ANY(compatibile_con)
ORDER BY name;

-- 4. Verifica coverage_types per acciaio
SELECT id, name, description, compatibile_con
FROM carport_coverage_types
WHERE 'acciaio' = ANY(compatibile_con)
ORDER BY name;

-- 5. Verifica color_options per acciaio (solo RAL)
SELECT id, name, hex_code, category, compatibile_con
FROM carport_color_options
WHERE 'acciaio' = ANY(compatibile_con)
  AND category = 'RAL'
ORDER BY name;

-- 6. Verifica surface_options
SELECT id, name, description, price_per_sqm
FROM carport_surface_options
ORDER BY price_per_sqm;
