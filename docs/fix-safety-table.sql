-- Check current table structure
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'pool_project_contract_safety'
ORDER BY ordinal_position;

-- Check existing constraints
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'pool_project_contract_safety'::regclass;

-- If there's a constraint on a non-existent column, drop it
-- ALTER TABLE pool_project_contract_safety DROP CONSTRAINT IF EXISTS chk_tpc_temp_barrier_type;

-- The correct table structure should only have these fields with VARCHAR(3) constraints:
-- tpc_tpsb VARCHAR(3) CHECK (tpc_tpsb IN ('Yes','No','N/A'))
-- tpc_power_connection VARCHAR(3) CHECK (tpc_power_connection IN ('Yes','No','N/A'))
-- tpc_hardcover VARCHAR(3) CHECK (tpc_hardcover IN ('Yes','No','N/A'))
-- tpc_ppsb VARCHAR(3) CHECK (tpc_ppsb IN ('Yes','No','N/A'))
-- tpc_temp_fence VARCHAR(3) CHECK (tpc_temp_fence IN ('Yes','No','N/A'))

-- If the columns are NOT NULL, we need to make them nullable to match our refactor pattern:
ALTER TABLE pool_project_contract_safety 
  ALTER COLUMN tpc_tpsb DROP NOT NULL,
  ALTER COLUMN tpc_power_connection DROP NOT NULL,
  ALTER COLUMN tpc_hardcover DROP NOT NULL,
  ALTER COLUMN tpc_ppsb DROP NOT NULL,
  ALTER COLUMN tpc_temp_fence DROP NOT NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable, 
       col_description(pgc.oid, cols.ordinal_position) as column_comment
FROM pg_class pgc
JOIN information_schema.columns cols 
  ON pgc.relname = cols.table_name
WHERE cols.table_name = 'pool_project_contract_safety'
ORDER BY cols.ordinal_position;