-- Add discounts CTE to the proposal_snapshot_v view
-- This joins pool_discounts with discount_promotions to get full discount details

-- First, let's add the discounts CTE after the existing CTEs (add this after line 156):

        , discounts AS (
         SELECT pd.pool_project_id,
            json_agg(
                json_build_object(
                    'id', pd.id,
                    'discount_promotion_uuid', pd.discount_promotion_uuid,
                    'discount_name', dp.discount_name,
                    'discount_type', dp.discount_type,
                    'dollar_value', dp.dollar_value,
                    'percentage_value', dp.percentage_value,
                    'created_at', pd.created_at
                ) ORDER BY pd.created_at
            ) AS applied_discounts_json
           FROM pool_discounts pd
           JOIN discount_promotions dp ON dp.uuid = pd.discount_promotion_uuid
          GROUP BY pd.pool_project_id
        )

-- Then, in the main SELECT statement, add these lines after line 333:

    crl.change_request_json,
    disc.applied_discounts_json

-- And add the LEFT JOIN after line 406:

     LEFT JOIN discounts disc ON disc.pool_project_id = pj.id

-- Complete modified section would look like:
-- After line 156, before the main SELECT:
        ), fencing_pricebook AS (
         SELECT json_agg(json_build_object('id', fc.id, 'item', fc.item, 'type', fc.type, 'unit_price', fc.unit_price, 'category', fc.category) ORDER BY fc.display_order) AS fencing_costs_json
           FROM fencing_costs fc
        ), discounts AS (
         SELECT pd.pool_project_id,
            json_agg(
                json_build_object(
                    'id', pd.id,
                    'discount_promotion_uuid', pd.discount_promotion_uuid,
                    'discount_name', dp.discount_name,
                    'discount_type', dp.discount_type,
                    'dollar_value', dp.dollar_value,
                    'percentage_value', dp.percentage_value,
                    'created_at', pd.created_at
                ) ORDER BY pd.created_at
            ) AS applied_discounts_json
           FROM pool_discounts pd
           JOIN discount_promotions dp ON dp.uuid = pd.discount_promotion_uuid
          GROUP BY pd.pool_project_id
        )

-- In the SELECT list (after line 333):
    pps.pin,
    crl.change_request_json,
    disc.applied_discounts_json

-- In the FROM/JOIN section (after line 406):
     LEFT JOIN extras ON extras.pool_project_id = pj.id
     LEFT JOIN discounts disc ON disc.pool_project_id = pj.id
     CROSS JOIN fencing_pricebook;