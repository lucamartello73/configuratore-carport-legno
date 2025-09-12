-- Create pergola configurator tables
CREATE TABLE IF NOT EXISTS configuratorelegno_pergola_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS configuratorelegno_coverage_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS configuratorelegno_accessories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS configuratorelegno_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('smalto', 'impregnante-legno', 'impregnante-pastello')),
  name TEXT NOT NULL,
  hex_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS configuratorelegno_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type_id UUID REFERENCES configuratorelegno_pergola_types(id),
  width INTEGER NOT NULL,
  depth INTEGER NOT NULL,
  height INTEGER NOT NULL,
  color_name TEXT NOT NULL,
  color_value TEXT NOT NULL,
  coverage_id UUID REFERENCES configuratorelegno_coverage_types(id),
  accessories JSONB DEFAULT '[]',
  service_type TEXT CHECK (service_type IN ('chiavi-in-mano', 'fai-da-te')),
  contact_data JSONB NOT NULL,
  contact_preference TEXT CHECK (contact_preference IN ('email', 'whatsapp', 'phone')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE configuratorelegno_pergola_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuratorelegno_coverage_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuratorelegno_accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuratorelegno_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuratorelegno_configurations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access pergola types" ON configuratorelegno_pergola_types
FOR SELECT USING (true);

CREATE POLICY "Public read access coverage types" ON configuratorelegno_coverage_types
FOR SELECT USING (true);

CREATE POLICY "Public read access accessories" ON configuratorelegno_accessories
FOR SELECT USING (true);

CREATE POLICY "Public read access colors" ON configuratorelegno_colors
FOR SELECT USING (true);

CREATE POLICY "Public insert configurations" ON configuratorelegno_configurations
FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read configurations" ON configuratorelegno_configurations
FOR SELECT USING (true);
