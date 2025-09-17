-- Populate missing coverage-structure type relationships
-- This script ensures all coverage types are linked to all structure types by default

-- First, let's see what we have
-- SELECT 'Current coverage types:' as info;
-- SELECT id, name FROM carport_coverage_types ORDER BY name;

-- SELECT 'Current structure types:' as info;
-- SELECT id, name FROM carport_structure_types WHERE is_active = true ORDER BY name;

-- SELECT 'Current links:' as info;
-- SELECT cst.*, ct.name as coverage_name, st.name as structure_name 
-- FROM carport_coverage_structure_types cst
-- JOIN carport_coverage_types ct ON ct.id = cst.coverage_type_id
-- JOIN carport_structure_types st ON st.id = cst.structure_type_id;

-- Insert missing relationships - link all coverage types to all active structure types
INSERT INTO carport_coverage_structure_types (coverage_type_id, structure_type_id)
SELECT ct.id as coverage_type_id, st.id as structure_type_id
FROM carport_coverage_types ct
CROSS JOIN carport_structure_types st
WHERE st.is_active = true
  AND NOT EXISTS (
    SELECT 1 
    FROM carport_coverage_structure_types cst 
    WHERE cst.coverage_type_id = ct.id 
      AND cst.structure_type_id = st.id
  )
ON CONFLICT (coverage_type_id, structure_type_id) DO NOTHING;

-- Verify the results
SELECT 
  st.name as structure_type,
  COUNT(cst.coverage_type_id) as linked_coverage_types
FROM carport_structure_types st
LEFT JOIN carport_coverage_structure_types cst ON st.id = cst.structure_type_id
WHERE st.is_active = true
GROUP BY st.id, st.name
ORDER BY st.name;
