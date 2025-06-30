-- Add bespoke discount support to discount_promotions table

-- Add applicability column with check constraint
ALTER TABLE discount_promotions 
ADD COLUMN applicability TEXT DEFAULT 'universal' CHECK (applicability IN ('universal', 'bespoke'));

-- Add pool_project_id for linking bespoke discounts to specific pools
ALTER TABLE discount_promotions 
ADD COLUMN pool_project_id UUID REFERENCES pool_projects(id);

-- Update existing records to be universal
UPDATE discount_promotions 
SET applicability = 'universal' 
WHERE applicability IS NULL;

-- Add index for performance when querying pool-specific discounts
CREATE INDEX idx_discount_promotions_pool_project_id 
ON discount_promotions(pool_project_id) 
WHERE pool_project_id IS NOT NULL;

-- Add index for filtering by applicability
CREATE INDEX idx_discount_promotions_applicability 
ON discount_promotions(applicability);