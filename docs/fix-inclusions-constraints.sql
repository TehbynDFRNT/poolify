-- Update CHECK constraints for pool_project_contract_inclusions_exclusions table
-- Change from 'Yes'/'No'/'N/A' to 'Included'/'Not Included' to match frontend values

-- First, drop all existing CHECK constraints
ALTER TABLE pool_project_contract_inclusions_exclusions
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_a_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_b_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_c_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_d_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_e_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_f_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_g_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_h_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_i_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_j_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_k_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_l_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_m_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_n_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_o_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_p_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_q_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_r_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_s_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_t_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_u_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_v_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_w_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_x_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_y_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_z_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_zz_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_aa_plugin_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_bb_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_cc_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_dd_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_ee_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_ff_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_gg_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_hh_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_jj_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_kk_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_ll_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_mm_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_nn_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_oo_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_pp_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_qq_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_rr_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_ss_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_tt_check,
  DROP CONSTRAINT IF EXISTS pool_project_contract_inclusions_exclusions_s7_inc_or_ex_uu_check;

-- Update column types to allow longer values and add new CHECK constraints
-- Most fields use 'Included' or 'Not Included' (IE type)
ALTER TABLE pool_project_contract_inclusions_exclusions
  ALTER COLUMN s7_inc_or_ex_a TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_b TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_c TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_d TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_e TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_f TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_g TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_h TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_i TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_j TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_k TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_l TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_m TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_n TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_o TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_p TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_q TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_r TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_s TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_t TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_u TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_v TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_w TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_x TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_y TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_z TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_zz TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_aa_plugin TYPE VARCHAR(20), -- Needs more space for electrical options
  ALTER COLUMN s7_inc_or_ex_bb TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_cc TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_dd TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_ee TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_ff TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_gg TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_hh TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_jj TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_kk TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_ll TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_mm TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_nn TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_oo TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_pp TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_qq TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_rr TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_ss TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_tt TYPE VARCHAR(12),
  ALTER COLUMN s7_inc_or_ex_uu TYPE VARCHAR(12);

-- Add new CHECK constraints for IE (Included/Excluded) type fields
ALTER TABLE pool_project_contract_inclusions_exclusions
  ADD CONSTRAINT s7_inc_or_ex_a_check CHECK (s7_inc_or_ex_a IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_b_check CHECK (s7_inc_or_ex_b IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_c_check CHECK (s7_inc_or_ex_c IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_d_check CHECK (s7_inc_or_ex_d IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_e_check CHECK (s7_inc_or_ex_e IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_f_check CHECK (s7_inc_or_ex_f IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_g_check CHECK (s7_inc_or_ex_g IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_h_check CHECK (s7_inc_or_ex_h IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_i_check CHECK (s7_inc_or_ex_i IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_j_check CHECK (s7_inc_or_ex_j IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_k_check CHECK (s7_inc_or_ex_k IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_l_check CHECK (s7_inc_or_ex_l IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_m_check CHECK (s7_inc_or_ex_m IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_n_check CHECK (s7_inc_or_ex_n IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_o_check CHECK (s7_inc_or_ex_o IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_p_check CHECK (s7_inc_or_ex_p IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_q_check CHECK (s7_inc_or_ex_q IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_r_check CHECK (s7_inc_or_ex_r IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_s_check CHECK (s7_inc_or_ex_s IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_t_check CHECK (s7_inc_or_ex_t IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_u_check CHECK (s7_inc_or_ex_u IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_v_check CHECK (s7_inc_or_ex_v IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_w_check CHECK (s7_inc_or_ex_w IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_x_check CHECK (s7_inc_or_ex_x IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_y_check CHECK (s7_inc_or_ex_y IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_z_check CHECK (s7_inc_or_ex_z IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_zz_check CHECK (s7_inc_or_ex_zz IN ('Included', 'Not Included')),
  -- Special constraint for electrical connection field (aa) which has more options
  ADD CONSTRAINT s7_inc_or_ex_aa_plugin_check CHECK (s7_inc_or_ex_aa_plugin IN ('Not Included', '10amp - Plug In', '15amp - Plug In', '20amp - Plug In', '25amp - Hardwired', '32amp - Hardwired', '40amp - Hardwired')),
  ADD CONSTRAINT s7_inc_or_ex_bb_check CHECK (s7_inc_or_ex_bb IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_cc_check CHECK (s7_inc_or_ex_cc IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_dd_check CHECK (s7_inc_or_ex_dd IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_ee_check CHECK (s7_inc_or_ex_ee IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_ff_check CHECK (s7_inc_or_ex_ff IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_gg_check CHECK (s7_inc_or_ex_gg IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_hh_check CHECK (s7_inc_or_ex_hh IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_jj_check CHECK (s7_inc_or_ex_jj IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_kk_check CHECK (s7_inc_or_ex_kk IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_ll_check CHECK (s7_inc_or_ex_ll IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_mm_check CHECK (s7_inc_or_ex_mm IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_nn_check CHECK (s7_inc_or_ex_nn IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_oo_check CHECK (s7_inc_or_ex_oo IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_pp_check CHECK (s7_inc_or_ex_pp IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_qq_check CHECK (s7_inc_or_ex_qq IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_rr_check CHECK (s7_inc_or_ex_rr IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_ss_check CHECK (s7_inc_or_ex_ss IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_tt_check CHECK (s7_inc_or_ex_tt IN ('Included', 'Not Included')),
  ADD CONSTRAINT s7_inc_or_ex_uu_check CHECK (s7_inc_or_ex_uu IN ('Included', 'Not Included'));

-- Note: If there's existing data, you may need to update it first:
-- UPDATE pool_project_contract_inclusions_exclusions 
-- SET s7_inc_or_ex_a = CASE 
--   WHEN s7_inc_or_ex_a = 'Yes' THEN 'Included'
--   WHEN s7_inc_or_ex_a = 'No' THEN 'Not Included'
--   ELSE s7_inc_or_ex_a
-- END;
-- (repeat for all columns)