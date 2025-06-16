-- 1. Create the table
CREATE TABLE pool_project_contract_site_details (
  id                            BIGSERIAL PRIMARY KEY,
  pool_project_contract_id      UUID NOT NULL
    REFERENCES pool_project_contract(id) ON DELETE CASCADE,

  -- Access & Site Conditions
  afe_item_2_sketch_provided     TEXT,    -- AFE - Item 2 - Sketch Provided
  afe_min_access_width_mm        INTEGER, -- AFE - Min Access Width
  afe_min_access_height_mm       INTEGER, -- AFE - Min Access Height
  afe_crane_required             BOOLEAN, -- AFE - Crane Required
  afe_item_4_fnp_fences_near_access_path BOOLEAN, -- AFE - Item 4 - FNP
  afe_item_6_tree_removal        BOOLEAN, -- AFE - Item 6 - Tree Removal

  -- Excavation (Item 8)
  afe_item_8_q1_overburden_preparation   TEXT,    -- AFE - Item 8 - Q1
  afe_item_8_q2_excavation_required      TEXT,    -- AFE - Item 8 - Q2
  afe_item_8_q3_excavation_method        TEXT,    -- AFE - Item 8 - Q3
  afe_item_8_q4_service_relocation       BOOLEAN, -- AFE - Item 8 - Q4
  afe_item_8_q5_service_relocation_party TEXT,    -- AFE - Item 8 - Q5
  afe_item_8_q6_material_left_on_site    BOOLEAN, -- AFE - Item 8 - Q6
  afe_item_8_q7_material_removed         BOOLEAN, -- AFE - Item 8 - Q7
  afe_item_8_q8_excavated_removal_party  TEXT,    -- AFE - Item 8 - Q8

  -- Responsibilities – Fences, Trees, etc.
  afe_item_4_rfm_removal_party           TEXT,    -- AFE - Item 4 - RFM
  afe_item_4_rrf_reinstatement_party     TEXT,    -- AFE - Item 4 - RRF
  afe_item_6_tree_removal_party          TEXT,    -- AFE - Item 6 - Tree Removal - Party
  afe_item_6_tree_replacement_party      TEXT,    -- AFE - Item 6 - Tree Replacement - Party

  -- Site Due-Diligence Notes
  afe_item_1_description_1_byd_findings  TEXT,    -- AFE - Item 1 Description 1
  afe_item_1_description_2_other_matters TEXT,    -- AFE - Item 1 Description 2

  -- Survey Reference
  datum_point_mm                         INTEGER, -- Datum Point

  -- Timestamps
  created_at                             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                             TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Only one details row per contract
  CONSTRAINT uq_site_details_per_contract UNIQUE (pool_project_contract_id)
);

-- 2. Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Bind the trigger
CREATE TRIGGER trg_site_details_updated
BEFORE UPDATE ON pool_project_contract_site_details
FOR EACH ROW
EXECUTE PROCEDURE trg_set_updated_at();
