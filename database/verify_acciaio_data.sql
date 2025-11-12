-- =====================================================
-- VERIFICA DATI ESISTENTI PER CONFIGURATORE ACCIAIO
-- =====================================================

-- 1. Tipi Struttura (devono essere solo Autoportante/Addossata)
SELECT id, name, description, image_url
FROM carport_structure_types
ORDER BY name;

-- 2. Modelli (devono essere collegati a structure_type_id)
SELECT id, name, description, image_url, structure_type_id
FROM carport_models
ORDER BY structure_type_id, name;

-- 3. Coperture (escludi "Perlinato con guaina ardesiata")
SELECT id, name, description
FROM carport_coverage_types
ORDER BY name;

-- 4. Colori (solo RAL per acciaio)
SELECT id, name, hex_code, category
FROM carport_colors
ORDER BY category, name;

-- 5. Superfici (nessuna pavimentazione, autocollocanti, cemento)
SELECT id, name, description, price_per_sqm
FROM carport_surfaces
ORDER BY name;
