-- 1. Create the extra‐costs table
CREATE TABLE pool_project_contract_extracosts (
  id                             BIGSERIAL PRIMARY KEY,
  pool_project_contract_id       UUID NOT NULL
    REFERENCES pool_project_contract(id)
      ON DELETE CASCADE,

  -- Extra‐Cost Risk Flags (Item 8)
  rfc_q1_siteboundaries          VARCHAR(3) NOT NULL CHECK (rfc_q1_siteboundaries   IN ('Yes','No','N/A')),  -- clause 6.4
  rfc_q2_accessthesite           VARCHAR(3) NOT NULL CHECK (rfc_q2_accessthesite      IN ('Yes','No','N/A')),  -- clause 7.4
  rfc_q3_ownerinterference       VARCHAR(3) NOT NULL CHECK (rfc_q3_ownerinterference  IN ('Yes','No','N/A')),  -- clause 7.6
  rfc_q4_primecost_variance      VARCHAR(3) NOT NULL CHECK (rfc_q4_primecost_variance IN ('Yes','No','N/A')),  -- clause 13
  rfc_q5_statutory_variations    VARCHAR(3) NOT NULL CHECK (rfc_q5_statutory_variations IN ('Yes','No','N/A')), -- clause 14
  rfc_q6_commencement_delay      VARCHAR(3) NOT NULL CHECK (rfc_q6_commencement_delay IN ('Yes','No','N/A')),  -- clause 15
  rfc_q7_latent_conditions       VARCHAR(3) NOT NULL CHECK (rfc_q7_latent_conditions  IN ('Yes','No','N/A')),  -- clause 16
  rfc_q8_works_suspension        VARCHAR(3) NOT NULL CHECK (rfc_q8_works_suspension   IN ('Yes','No','N/A')),  -- clause 17
  rfc_q9_excavated_fill_dumping  VARCHAR(3) NOT NULL CHECK (rfc_q9_excavated_fill_dumping IN ('Yes','No','N/A')), -- clause 20.6
  rfc_q10_product_substitution   VARCHAR(3) NOT NULL CHECK (rfc_q10_product_substitution  IN ('Yes','No','N/A')), -- clause 22.9
  rfc_total_special_conditions   VARCHAR(3) NOT NULL CHECK (rfc_total_special_conditions IN ('Yes','No','N/A')), -- clause 39

  -- Third-party components flag
  third_party_components         VARCHAR(3) NOT NULL CHECK (third_party_components    IN ('Yes','No','N/A')),

  -- audit timestamps
  created_at                     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- enforce exactly one row per contract
  CONSTRAINT uq_extracosts_per_contract UNIQUE (pool_project_contract_id)
);

-- 2. Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION trg_update_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- 3. Attach trigger to the table
CREATE TRIGGER trg_extracosts_updated
BEFORE UPDATE ON pool_project_contract_extracosts
FOR EACH ROW
EXECUTE PROCEDURE trg_update_timestamp();


**Extra-Cost Risk Flags (Item 8 of the schedule)**

| #  | Question in the form                                                                                           | JSON key                 |
| -- | -------------------------------------------------------------------------------------------------------------- | ------------------------ |
| 1  | Extra costs incurred by the contractor in locating site boundaries and underground services (Refer Clause 6.4) | `RFC - Q1`               |
| 2  | Extra costs incurred by the contractor in accessing the site (Refer Clause 7.4)                                | `RFC - Q2`               |
| 3  | Extra costs for owner interference claimed by the contractor (Refer Clause 7.6)                                | `RFC - Q3`               |
| 4  | The actual cost of prime cost items / provisional sums being less or exceeding the estimates (Refer Clause 13) | `RFC - Q4`               |
| 5  | Variations required by a statutory authority incl. private certifier (Refer Clause 14)                         | `RFC - Q5`               |
| 6  | Where commencement or progress of the works is delayed (Refer Clause 15)                                       | `RFC - Q6`               |
| 7  | Extra costs incurred to overcome latent conditions (Refer Clause 16)                                           | `RFC - Q7`               |
| 8  | Extra costs incurred as a result of a suspension of the works (Refer Clause 17)                                | `RFC - Q8`               |
| 9  | Extra costs incurred in carting and dumping excavated fill (Refer Clause 20.6)                                 | `RFC - Q9`               |
| 10 | Extra costs as a result of a product substitution (Refer Clause 22.9)                                          | `RFC - Q10`              |
| 11 | Any special conditions that may result in cost increases (Refer Clause 39)                                     | `RFC - Total`            |
| 12 | The contract price does not include the cost of any third-party components (see Item 4 & Schedule 3)           | `Third Party Components` |
