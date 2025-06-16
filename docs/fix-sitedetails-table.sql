-- Fix site details table to match application expectations
-- Issue: afe_item_6_tree_removal is BOOLEAN in DB but application expects VARCHAR with 'Yes'/'No'/'N/A' values

-- Check current table structure
SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
FROM information_schema.columns
WHERE table_name = 'pool_project_contract_site_details'
  AND column_name LIKE '%afe_item_%'
ORDER BY ordinal_position;

-- Check existing constraints
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'pool_project_contract_site_details'::regclass;

-- Fix the type mismatch for boolean fields that should be VARCHAR(3) with constraints
-- These fields are used with R1_OPTIONS ("Yes", "No", "N/A") in the application

-- 1. afe_item_6_tree_removal - Tree Removal field (the main issue)
ALTER TABLE pool_project_contract_site_details 
  ALTER COLUMN afe_item_6_tree_removal TYPE VARCHAR(3) USING 
    CASE 
      WHEN afe_item_6_tree_removal = true THEN 'Yes'
      WHEN afe_item_6_tree_removal = false THEN 'No'
      ELSE NULL
    END;

-- Add constraint to ensure valid values
ALTER TABLE pool_project_contract_site_details 
  ADD CONSTRAINT chk_afe_item_6_tree_removal 
  CHECK (afe_item_6_tree_removal IN ('Yes', 'No', 'N/A'));

-- 2. Fix other boolean fields that should be VARCHAR(3) based on application usage

-- afe_crane_required - used with R1_OPTIONS
ALTER TABLE pool_project_contract_site_details 
  ALTER COLUMN afe_crane_required TYPE VARCHAR(3) USING 
    CASE 
      WHEN afe_crane_required = true THEN 'Yes'
      WHEN afe_crane_required = false THEN 'No'
      ELSE NULL
    END;

ALTER TABLE pool_project_contract_site_details 
  ADD CONSTRAINT chk_afe_crane_required 
  CHECK (afe_crane_required IN ('Yes', 'No', 'N/A'));

-- afe_item_4_fnp_fences_near_access_path - used with R1_OPTIONS
ALTER TABLE pool_project_contract_site_details 
  ALTER COLUMN afe_item_4_fnp_fences_near_access_path TYPE VARCHAR(3) USING 
    CASE 
      WHEN afe_item_4_fnp_fences_near_access_path = true THEN 'Yes'
      WHEN afe_item_4_fnp_fences_near_access_path = false THEN 'No'
      ELSE NULL
    END;

ALTER TABLE pool_project_contract_site_details 
  ADD CONSTRAINT chk_afe_item_4_fnp_fences_near_access_path 
  CHECK (afe_item_4_fnp_fences_near_access_path IN ('Yes', 'No', 'N/A'));

-- Fix S1_OPTIONS fields (Yes/No/Unknown)
-- afe_item_8_q4_service_relocation - used with S1_OPTIONS  
ALTER TABLE pool_project_contract_site_details 
  ALTER COLUMN afe_item_8_q4_service_relocation TYPE VARCHAR(7) USING 
    CASE 
      WHEN afe_item_8_q4_service_relocation = true THEN 'Yes'
      WHEN afe_item_8_q4_service_relocation = false THEN 'No'
      ELSE NULL
    END;

ALTER TABLE pool_project_contract_site_details 
  ADD CONSTRAINT chk_afe_item_8_q4_service_relocation 
  CHECK (afe_item_8_q4_service_relocation IN ('Yes', 'No', 'Unknown'));

-- Fix remaining boolean fields that should be R1_OPTIONS
-- afe_item_8_q6_material_left_on_site
ALTER TABLE pool_project_contract_site_details 
  ALTER COLUMN afe_item_8_q6_material_left_on_site TYPE VARCHAR(3) USING 
    CASE 
      WHEN afe_item_8_q6_material_left_on_site = true THEN 'Yes'
      WHEN afe_item_8_q6_material_left_on_site = false THEN 'No'
      ELSE NULL
    END;

ALTER TABLE pool_project_contract_site_details 
  ADD CONSTRAINT chk_afe_item_8_q6_material_left_on_site 
  CHECK (afe_item_8_q6_material_left_on_site IN ('Yes', 'No', 'N/A'));

-- afe_item_8_q7_material_removed
ALTER TABLE pool_project_contract_site_details 
  ALTER COLUMN afe_item_8_q7_material_removed TYPE VARCHAR(3) USING 
    CASE 
      WHEN afe_item_8_q7_material_removed = true THEN 'Yes'
      WHEN afe_item_8_q7_material_removed = false THEN 'No'
      ELSE NULL
    END;

ALTER TABLE pool_project_contract_site_details 
  ADD CONSTRAINT chk_afe_item_8_q7_material_removed 
  CHECK (afe_item_8_q7_material_removed IN ('Yes', 'No', 'N/A'));

-- Verify the changes
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'pool_project_contract_site_details'
  AND column_name LIKE '%afe_item_%'
ORDER BY ordinal_position;

-- Verify constraints were added
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'pool_project_contract_site_details'::regclass
  AND conname LIKE 'chk_%';