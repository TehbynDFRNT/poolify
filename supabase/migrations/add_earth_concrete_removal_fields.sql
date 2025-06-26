-- Add earth and concrete removal fields to pool_site_conditions
ALTER TABLE pool_site_conditions
ADD COLUMN remove_slab TEXT,
ADD COLUMN earthmoving TEXT;

-- Add comments for clarity
COMMENT ON COLUMN pool_site_conditions.remove_slab IS 'Concrete slab removal requirement';
COMMENT ON COLUMN pool_site_conditions.earthmoving IS 'Earthmoving requirement (Batter, PreCut, Misc)';