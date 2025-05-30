-- This file contains the fix for the proposal_snapshot_v view
-- The issue: The 'fixed' CTE is defined but never joined in the main query
-- This causes fixed_costs_json to always be NULL

-- To fix the view, add this line after "FROM target pj" and before the LEFT JOINs:
-- CROSS JOIN fixed

-- The fixed CTE aggregates all fixed costs into a single JSON array, so CROSS JOIN is appropriate
-- since it will add that single row to every result row.

-- Example of where to add it in the view:
/*
   FROM target pj
     CROSS JOIN fixed              -- ADD THIS LINE
     CROSS JOIN fencing_pricebook  -- (this one is already there)
     LEFT JOIN concrete_selections con ON con.pool_project_id = pj.id
     ... rest of the joins ...
*/

-- After applying this fix, the fixed_costs_json field will contain data like:
-- [
--   {"id": "...", "name": "Form 15", "price": "1295"},
--   {"id": "...", "name": "Freight", "price": "800"},
--   ... etc
-- ]