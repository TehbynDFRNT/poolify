-- 1. Create the inclusions/exclusions table
CREATE TABLE pool_project_contract_inclusions_exclusions (
  id                          BIGSERIAL PRIMARY KEY,
  pool_project_contract_id    UUID NOT NULL
    REFERENCES pool_project_contract(id)
      ON DELETE CASCADE,

  /* Schedule 3: Included & Excluded Items */
  s7_inc_or_ex_a              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_a  IN ('Yes','No','N/A')),
  s7_inc_or_ex_b              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_b  IN ('Yes','No','N/A')),
  s7_inc_or_ex_c              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_c  IN ('Yes','No','N/A')),
  s7_inc_or_ex_d              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_d  IN ('Yes','No','N/A')),
  s7_inc_or_ex_e              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_e  IN ('Yes','No','N/A')),
  s7_inc_or_ex_f              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_f  IN ('Yes','No','N/A')),
  s7_inc_or_ex_g              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_g  IN ('Yes','No','N/A')),
  s7_inc_or_ex_h              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_h  IN ('Yes','No','N/A')),
  s7_inc_or_ex_i              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_i  IN ('Yes','No','N/A')),
  s7_inc_or_ex_j              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_j  IN ('Yes','No','N/A')),
  s7_inc_or_ex_k              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_k  IN ('Yes','No','N/A')),
  s7_inc_or_ex_l              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_l  IN ('Yes','No','N/A')),
  s7_inc_or_ex_m              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_m  IN ('Yes','No','N/A')),
  s7_inc_or_ex_n              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_n  IN ('Yes','No','N/A')),
  s7_inc_or_ex_o              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_o  IN ('Yes','No','N/A')),
  s7_inc_or_ex_p              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_p  IN ('Yes','No','N/A')),
  s7_inc_or_ex_q              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_q  IN ('Yes','No','N/A')),
  s7_inc_or_ex_r              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_r  IN ('Yes','No','N/A')),
  s7_inc_or_ex_s              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_s  IN ('Yes','No','N/A')),
  s7_inc_or_ex_t              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_t  IN ('Yes','No','N/A')),
  s7_inc_or_ex_u              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_u  IN ('Yes','No','N/A')),
  s7_inc_or_ex_v              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_v  IN ('Yes','No','N/A')),
  s7_inc_or_ex_w              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_w  IN ('Yes','No','N/A')),
  s7_inc_or_ex_x              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_x  IN ('Yes','No','N/A')),
  s7_inc_or_ex_y              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_y  IN ('Yes','No','N/A')),
  s7_inc_or_ex_z              VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_z  IN ('Yes','No','N/A')),
  s7_inc_or_ex_zz             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_zz IN ('Yes','No','N/A')),
  s7_inc_or_ex_aa_plugin      VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_aa_plugin IN ('Yes','No','N/A')),
  s7_inc_or_ex_bb             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_bb IN ('Yes','No','N/A')),
  s7_inc_or_ex_cc             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_cc IN ('Yes','No','N/A')),
  s7_inc_or_ex_dd             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_dd IN ('Yes','No','N/A')),
  s7_inc_or_ex_ee             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_ee IN ('Yes','No','N/A')),
  s7_inc_or_ex_ff             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_ff IN ('Yes','No','N/A')),
  s7_inc_or_ex_gg             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_gg IN ('Yes','No','N/A')),
  s7_inc_or_ex_hh             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_hh IN ('Yes','No','N/A')),
  s7_inc_or_ex_jj             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_jj IN ('Yes','No','N/A')),
  s7_inc_or_ex_kk             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_kk IN ('Yes','No','N/A')),
  s7_inc_or_ex_ll             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_ll IN ('Yes','No','N/A')),
  s7_inc_or_ex_mm             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_mm IN ('Yes','No','N/A')),
  s7_inc_or_ex_nn             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_nn IN ('Yes','No','N/A')),
  s7_inc_or_ex_oo             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_oo IN ('Yes','No','N/A')),
  s7_inc_or_ex_pp             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_pp IN ('Yes','No','N/A')),
  s7_inc_or_ex_qq             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_qq IN ('Yes','No','N/A')),
  s7_inc_or_ex_rr             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_rr IN ('Yes','No','N/A')),
  s7_inc_or_ex_ss             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_ss IN ('Yes','No','N/A')),
  s7_inc_or_ex_tt             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_tt IN ('Yes','No','N/A')),
  s7_inc_or_ex_uu             VARCHAR(3) NOT NULL CHECK (s7_inc_or_ex_uu IN ('Yes','No','N/A')),

  /* audit timestamps */
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  /* one‐row‐per‐contract */
  CONSTRAINT uq_incl_excl_per_contract UNIQUE (pool_project_contract_id)
);

-- 2. Reuse or define trg_update_timestamp()
CREATE OR REPLACE FUNCTION trg_update_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- 3. Attach trigger
CREATE TRIGGER trg_incl_excl_updated
BEFORE UPDATE ON pool_project_contract_inclusions_exclusions
FOR EACH ROW
EXECUTE PROCEDURE trg_update_timestamp();
