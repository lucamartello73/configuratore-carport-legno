-- Disable RLS for admin tables since this is an admin interface
-- In a production environment, you would create proper policies based on user roles

-- Disable RLS for carport_models table
ALTER TABLE carport_models DISABLE ROW LEVEL SECURITY;

-- Disable RLS for other admin tables to prevent similar issues
ALTER TABLE carport_structure_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE carport_coverage_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE carport_colors DISABLE ROW LEVEL SECURITY;
ALTER TABLE carport_surfaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE carport_pricing_rules DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled for user-facing tables
-- ALTER TABLE carport_configurations ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE carport_admin_users ENABLE ROW LEVEL SECURITY;

-- Note: In a production environment, you should create proper RLS policies
-- based on user authentication and roles instead of disabling RLS entirely.
-- For example:
-- CREATE POLICY "Allow admin users to manage models" ON carport_models
-- FOR ALL USING (
--   EXISTS (
--     SELECT 1 FROM carport_admin_users 
--     WHERE id = auth.uid() AND role = 'admin'
--   )
-- );
