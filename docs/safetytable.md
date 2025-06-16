-- 1. Create the safety table
CREATE TABLE pool_project_contract_safety (
  id                       BIGSERIAL PRIMARY KEY,
  pool_project_contract_id UUID NOT NULL
    REFERENCES pool_project_contract(id)
      ON DELETE CASCADE,

  /* Safety & Temporary Works fields as constrained strings */
  tpc_tpsb           VARCHAR(3) NOT NULL CHECK (tpc_tpsb   IN ('Yes','No','N/A')),  -- Temporary pool safety barrier required?
  tpc_power_connection VARCHAR(3) NOT NULL CHECK (tpc_power_connection IN ('Yes','No','N/A')),  -- Power connection (temp-works)
  tpc_hardcover      VARCHAR(3) NOT NULL CHECK (tpc_hardcover IN ('Yes','No','N/A')),  -- Hard cover over pool shell required?
  tpc_ppsb           VARCHAR(3) NOT NULL CHECK (tpc_ppsb   IN ('Yes','No','N/A')),  -- Permanent pool safety barrier included?
  tpc_temp_fence     VARCHAR(3) NOT NULL CHECK (tpc_temp_fence IN ('Yes','No','N/A')),  -- Temporary fence supplied?

  /* audit timestamps */
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  /* only one row per contract */
  CONSTRAINT uq_safety_per_contract UNIQUE (pool_project_contract_id)
);

-- 2. Trigger function to keep updated_at current
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach trigger to update timestamp on any row change
CREATE TRIGGER trg_safety_updated_at
BEFORE UPDATE ON pool_project_contract_safety
FOR EACH ROW
EXECUTE PROCEDURE trg_set_updated_at();


| # | Question in the form                    | JSON key                 |
| - | --------------------------------------- | ------------------------ |
| 1 | Temporary pool safety barrier required? | `TPC - TPSB`             |
| 2 | Power connection (temp-works)           | `TPC - Power Connection` |
| 3 | Hard cover over pool shell required?    | `TPC - Hardcover`        |
| 4 | Permanent pool safety barrier included? | `TPC - PPSB`             |
| 5 | Temporary fence supplied?               | `TPC - Temp Fence`       |
