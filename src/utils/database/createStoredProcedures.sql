
-- Create a function to get a crane selection for a pool
CREATE OR REPLACE FUNCTION get_crane_selection_for_pool(pool_id_param UUID)
RETURNS TABLE (pool_id UUID, crane_id UUID) AS $$
BEGIN
  RETURN QUERY 
  SELECT pcs.pool_id, pcs.crane_id
  FROM pool_crane_selections pcs
  WHERE pcs.pool_id = pool_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get crane with details for a pool
CREATE OR REPLACE FUNCTION get_crane_with_details_for_pool(pool_id_param UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  price NUMERIC,
  display_order INTEGER,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  crane_id_var UUID;
BEGIN
  -- First try to get the crane_id from pool_crane_selections
  SELECT crane_id INTO crane_id_var
  FROM pool_crane_selections
  WHERE pool_id = pool_id_param;

  -- If a selection exists, get that crane's details
  IF FOUND THEN
    RETURN QUERY
    SELECT cc.id, cc.name, cc.price, cc.display_order, cc.created_at
    FROM crane_costs cc
    WHERE cc.id = crane_id_var;
  ELSE
    -- Otherwise get the default Franna crane
    RETURN QUERY
    SELECT cc.id, cc.name, cc.price, cc.display_order, cc.created_at
    FROM crane_costs cc
    WHERE cc.name = 'Franna Crane-S20T-L1';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a function to update a crane selection
CREATE OR REPLACE FUNCTION update_crane_selection(p_pool_id UUID, p_crane_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE pool_crane_selections
  SET crane_id = p_crane_id
  WHERE pool_id = p_pool_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to insert a crane selection
CREATE OR REPLACE FUNCTION insert_crane_selection(p_pool_id UUID, p_crane_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO pool_crane_selections (pool_id, crane_id)
  VALUES (p_pool_id, p_crane_id);
END;
$$ LANGUAGE plpgsql;
