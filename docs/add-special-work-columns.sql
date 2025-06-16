-- ALTER TABLE statements to add missing columns to pool_project_contract_special_work

ALTER TABLE pool_project_contract_special_work 
ADD COLUMN special_considerations TEXT;

ALTER TABLE pool_project_contract_special_work 
ADD COLUMN special_access TEXT;

ALTER TABLE pool_project_contract_special_work 
ADD COLUMN special_access_notes TEXT;