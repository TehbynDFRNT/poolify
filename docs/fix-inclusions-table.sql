-- Remove NOT NULL constraints from pool_project_contract_inclusions_exclusions table
-- This allows the refactored components to use independent state management
-- where fields are only updated when explicitly provided

-- Remove NOT NULL constraints for all s7_inc_or_ex_* fields
ALTER TABLE pool_project_contract_inclusions_exclusions 
  ALTER COLUMN s7_inc_or_ex_a DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_b DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_c DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_d DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_e DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_f DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_g DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_h DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_i DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_j DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_k DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_l DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_m DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_n DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_o DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_p DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_q DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_r DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_s DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_t DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_u DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_v DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_w DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_x DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_y DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_z DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_zz DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_aa_plugin DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_bb DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_cc DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_dd DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_ee DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_ff DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_gg DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_hh DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_jj DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_kk DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_ll DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_mm DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_nn DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_oo DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_pp DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_qq DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_rr DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_ss DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_tt DROP NOT NULL,
  ALTER COLUMN s7_inc_or_ex_uu DROP NOT NULL;

-- Note: The CHECK constraints remain intact to ensure data integrity
-- when values are provided, they must still be within the allowed set