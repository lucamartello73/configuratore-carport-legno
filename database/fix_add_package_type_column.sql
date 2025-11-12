-- =====================================================
-- FIX: Aggiungi colonna package_type mancante
-- Tabella: carport_legno_configurations
-- Data: 2025-11-12
-- =====================================================

-- 1. Aggiungi colonna package_type alla tabella configurations
ALTER TABLE carport_legno_configurations 
ADD COLUMN IF NOT EXISTS package_type VARCHAR(50) DEFAULT 'Standard';

-- 2. Aggiungi commento descrittivo
COMMENT ON COLUMN carport_legno_configurations.package_type IS 'Tipo di pacchetto scelto dal cliente (es: Standard, Chiavi in Mano)';

-- 3. Verifica che la colonna sia stata aggiunta
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'carport_legno_configurations'
  AND column_name = 'package_type';

-- 4. (Opzionale) Se vuoi rendere la colonna NOT NULL dopo averla popolata
-- ALTER TABLE carport_legno_configurations 
-- ALTER COLUMN package_type SET NOT NULL;

-- =====================================================
-- VERIFICA COMPLETA SCHEMA TABELLA
-- =====================================================

SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'carport_legno_configurations'
ORDER BY ordinal_position;
