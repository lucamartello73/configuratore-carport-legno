-- =====================================================
-- VERIFICA: Check constraint su colonna status
-- =====================================================

-- 1. Verifica constraint esistenti sulla tabella
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'carport_legno_configurations'::regclass
  AND contype = 'c';  -- c = check constraint

-- 2. Verifica colonna status
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'carport_legno_configurations'
  AND column_name = 'status';
