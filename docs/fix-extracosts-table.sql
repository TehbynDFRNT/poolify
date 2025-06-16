-- Check current table structure for pool_project_contract_extracosts
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'pool_project_contract_extracosts'
ORDER BY ordinal_position;

-- Check existing constraints
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'pool_project_contract_extracosts'::regclass;

-- The table structure may have NOT NULL constraints that need to be removed
-- to match the refactor pattern used in other sections (safety, site details, etc.)

-- Remove NOT NULL constraints to allow NULL values for the refactor pattern
ALTER TABLE pool_project_contract_extracosts 
  ALTER COLUMN rfc_q1_siteboundaries DROP NOT NULL,
  ALTER COLUMN rfc_q2_accessthesite DROP NOT NULL,
  ALTER COLUMN rfc_q3_ownerinterference DROP NOT NULL,
  ALTER COLUMN rfc_q4_primecost_variance DROP NOT NULL,
  ALTER COLUMN rfc_q5_statutory_variations DROP NOT NULL,
  ALTER COLUMN rfc_q6_commencement_delay DROP NOT NULL,
  ALTER COLUMN rfc_q7_latent_conditions DROP NOT NULL,
  ALTER COLUMN rfc_q8_works_suspension DROP NOT NULL,
  ALTER COLUMN rfc_q9_excavated_fill_dumping DROP NOT NULL,
  ALTER COLUMN rfc_q10_product_substitution DROP NOT NULL,
  ALTER COLUMN rfc_total_special_conditions DROP NOT NULL,
  ALTER COLUMN third_party_components DROP NOT NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable, 
       col_description(pgc.oid, cols.ordinal_position) as column_comment
FROM pg_class pgc
JOIN information_schema.columns cols 
  ON pgc.relname = cols.table_name
WHERE cols.table_name = 'pool_project_contract_extracosts'
ORDER BY cols.ordinal_position;