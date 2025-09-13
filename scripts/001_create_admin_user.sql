-- Create default admin user
-- Password: admin123 (hashed with bcrypt)

INSERT INTO carport_admin_users (
  id,
  email,
  password_hash,
  name,
  role,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@carport.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Administrator',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
