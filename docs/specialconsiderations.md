
| # | Question in the form          | JSON key                        |
| - | ----------------------------- | ------------------------------- |
| 1 | Extra or special work details | `ExtraSpecialNotes`             |
| 2 | Owner-supplied item #1        | `C-Item 17 - OSI Description 1` |
| 3 | Owner-supplied item #2        | `C-Item 17 - OSI Description 2` |
 
 
-- 1. Create the special-work & owner-supplied table
CREATE TABLE pool_project_contract_special_work (
  id                            BIGSERIAL PRIMARY KEY,
  pool_project_contract_id      UUID NOT NULL
    REFERENCES pool_project_contract(id)
      ON DELETE CASCADE,

  -- free-text special-work instructions
  extra_special_notes           TEXT,    -- Extra or special work details

  -- owner-supplied items
  c_item_17_osi_description_1   TEXT,    -- Owner-supplied item #1
  c_item_17_osi_description_2   TEXT,    -- Owner-supplied item #2

  -- audit timestamps
  created_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- enforce one row per contract
  CONSTRAINT uq_special_work_per_contract UNIQUE (pool_project_contract_id)
);

-- 2. We can reuse the existing trg_update_timestamp() function if present,
--    otherwise define it as follows:

CREATE OR REPLACE FUNCTION trg_update_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- 3. Attach the trigger to keep updated_at current
CREATE TRIGGER trg_special_work_updated
BEFORE UPDATE ON pool_project_contract_special_work
FOR EACH ROW
EXECUTE PROCEDURE trg_update_timestamp();
