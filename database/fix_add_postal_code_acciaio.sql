-- =====================================================
-- FIX: Aggiungi colonna customer_postal_code mancante
-- Tabella: carport_configurations (acciaio)
-- Data: 2025-11-12
-- =====================================================

-- 1. Verifica schema attuale
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'carport_configurations'
ORDER BY ordinal_position;

-- 2. Aggiungi colonna customer_postal_code se non esiste
ALTER TABLE carport_configurations 
ADD COLUMN IF NOT EXISTS customer_postal_code VARCHAR(10);

-- 3. Aggiungi anche package_type se mancante (come per legno)
ALTER TABLE carport_configurations 
ADD COLUMN IF NOT EXISTS package_type VARCHAR(50) DEFAULT 'Standard';

-- 4. Verifica colonne aggiunte
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'carport_configurations'
  AND column_name IN ('customer_postal_code', 'package_type');

-- 5. Verifica schema completo finale
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'carport_configurations'
ORDER BY ordinal_position;
