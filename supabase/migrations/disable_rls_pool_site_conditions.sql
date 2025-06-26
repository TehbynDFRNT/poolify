-- Disable RLS on pool_site_conditions table
ALTER TABLE pool_site_conditions DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies (cleanup)
DROP POLICY IF EXISTS "Enable read access for all users" ON pool_site_conditions;
DROP POLICY IF EXISTS "Enable insert access for all users" ON pool_site_conditions;
DROP POLICY IF EXISTS "Enable update access for all users" ON pool_site_conditions;
DROP POLICY IF EXISTS "Enable delete access for all users" ON pool_site_conditions;