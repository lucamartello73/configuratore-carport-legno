-- Migration: Add structure_category field to carport_structure_types
-- Purpose: Enable FERRO/LEGNO filtering for structure types

-- Add column structure_category
ALTER TABLE carport_structure_types 
ADD COLUMN IF NOT EXISTS structure_category TEXT;

-- Set default value for existing records (you need to update manually)
-- UPDATE carport_structure_types SET structure_category = 'FERRO' WHERE id IN (...);
-- UPDATE carport_structure_types SET structure_category = 'LEGNO' WHERE id IN (...);

-- Add check constraint
ALTER TABLE carport_structure_types
ADD CONSTRAINT structure_category_check 
CHECK (structure_category IN ('FERRO', 'LEGNO'));

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_structure_types_category 
ON carport_structure_types(structure_category);

-- Comments
COMMENT ON COLUMN carport_structure_types.structure_category IS 'Configurator type: FERRO or LEGNO';
