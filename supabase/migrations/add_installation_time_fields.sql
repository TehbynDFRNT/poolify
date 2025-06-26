-- Create pool_site_conditions table
CREATE TABLE IF NOT EXISTS pool_site_conditions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pool_project_id UUID NOT NULL UNIQUE REFERENCES pool_projects(id) ON DELETE CASCADE,
  access_grade TEXT,
  distance_from_truck TEXT,
  pool_shell_delivery TEXT,
  sewer_diversion TEXT,
  stormwater_diversion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add comments for clarity
COMMENT ON TABLE pool_site_conditions IS 'Site conditions and requirements for pool installation';
COMMENT ON COLUMN pool_site_conditions.pool_project_id IS 'Foreign key to pool_projects table (unique constraint ensures one record per project)';
COMMENT ON COLUMN pool_site_conditions.access_grade IS 'Site access grade affecting installation time';
COMMENT ON COLUMN pool_site_conditions.distance_from_truck IS 'Distance from truck to pool hole';
COMMENT ON COLUMN pool_site_conditions.pool_shell_delivery IS 'Pool shell delivery method';
COMMENT ON COLUMN pool_site_conditions.sewer_diversion IS 'Whether sewer diversion is required';
COMMENT ON COLUMN pool_site_conditions.stormwater_diversion IS 'Whether stormwater diversion is required';

-- Create index for foreign key
CREATE INDEX idx_pool_site_conditions_pool_project_id ON pool_site_conditions(pool_project_id);

-- Enable Row Level Security
ALTER TABLE pool_site_conditions ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger
CREATE TRIGGER update_pool_site_conditions_updated_at BEFORE UPDATE ON pool_site_conditions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();