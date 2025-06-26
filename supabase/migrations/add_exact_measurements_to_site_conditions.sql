-- Add exact measurement fields to pool_site_conditions
ALTER TABLE pool_site_conditions
ADD COLUMN remove_slab_sqm DECIMAL(10,2),
ADD COLUMN earthmoving_cubic_meters DECIMAL(10,2);

-- Add comments for clarity
COMMENT ON COLUMN pool_site_conditions.remove_slab_sqm IS 'Exact square meters of concrete slab to be removed';
COMMENT ON COLUMN pool_site_conditions.earthmoving_cubic_meters IS 'Exact cubic meters of earth to be moved';