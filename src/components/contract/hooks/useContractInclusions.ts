/**
 * Hook for managing contract inclusions/exclusions data
 * Handles CRUD operations for pool_project_contract_inclusions_exclusions table
 * Used by InclusionsSection component
 */
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContractInclusionsData {
  // Schedule 3: Included & Excluded Items (mapping frontend camelCase to database snake_case)
  s7_inc_or_ex_a?: string;              // a: Locating underground services
  s7_inc_or_ex_b?: string;              // b: Rerouting underground power/services
  s7_inc_or_ex_c?: string;              // c: Rerouting sewer/stormwater
  s7_inc_or_ex_d?: string;              // d: Seeking neighbours/council consent
  s7_inc_or_ex_e?: string;              // e: Removal of fences/obstructions
  s7_inc_or_ex_f?: string;              // f: Removal of trees
  s7_inc_or_ex_g?: string;              // g: Survey of site
  s7_inc_or_ex_h?: string;              // h: Sewer approval/connection
  s7_inc_or_ex_i?: string;              // i: Backwash/pump-out water pipe >6m
  s7_inc_or_ex_j?: string;              // j: Geotechnical/engineering reports
  s7_inc_or_ex_k?: string;              // k: Manual excavation
  s7_inc_or_ex_l?: string;              // l: Mechanical excavation
  s7_inc_or_ex_m?: string;              // m: Cartage fees for excavated material
  s7_inc_or_ex_n?: string;              // n: Tipping fees for excavated material
  s7_inc_or_ex_o?: string;              // o: Levelling/spreading excavated material
  s7_inc_or_ex_p?: string;              // p: Additional overburden excavation/disposal
  s7_inc_or_ex_q?: string;              // q: Compaction of fill >300mm
  s7_inc_or_ex_r?: string;              // r: Extension for in-fill step
  s7_inc_or_ex_s?: string;              // s: Additional concrete for oversize shell
  s7_inc_or_ex_t?: string;              // t: Additional steel for oversize shell
  s7_inc_or_ex_u?: string;              // u: Pre-cut site to level
  s7_inc_or_ex_v?: string;              // v: Rock/shale excavation
  s7_inc_or_ex_w?: string;              // w: Transportation of excavated earth
  s7_inc_or_ex_x?: string;              // x: Overcoming uncompacted fill/water table
  s7_inc_or_ex_y?: string;              // y: Pumping ground water
  s7_inc_or_ex_z?: string;              // z: Electrical earth bond
  s7_inc_or_ex_zz?: string;             // zz: This doesn't appear to map to any frontend field
  s7_inc_or_ex_aa_plugin?: string;      // aa: Electrical connection to mains (heat pumps)
  s7_inc_or_ex_bb?: string;             // bb: Electrical supply/connection to filtration
  s7_inc_or_ex_cc?: string;             // cc: Temporary pool safety barrier hire
  s7_inc_or_ex_dd?: string;             // dd: Permanent pool safety barrier
  s7_inc_or_ex_ee?: string;             // ee: Piering of structural beam around pool
  s7_inc_or_ex_ff?: string;             // ff: Piering of extended paving
  s7_inc_or_ex_gg?: string;             // gg: Piering/special structural requirements
  s7_inc_or_ex_hh?: string;             // hh: Concrete pump
  s7_inc_or_ex_jj?: string;             // jj: Replacement of fences/obstructions
  s7_inc_or_ex_kk?: string;             // kk: Removal of rubbish/wastage
  s7_inc_or_ex_ll?: string;             // ll: Skip bin hire
  s7_inc_or_ex_mm?: string;             // mm: Full reinstatement of land/gardens
  s7_inc_or_ex_nn?: string;             // nn: Enclosures/sound-proofing of equipment
  s7_inc_or_ex_oo?: string;             // oo: Additional paperwork for filtration repositioning
  s7_inc_or_ex_pp?: string;             // pp: Pool heating
  s7_inc_or_ex_qq?: string;             // qq: Cost of overcoming latent conditions
  s7_inc_or_ex_rr?: string;             // rr: Water for filling pool
  s7_inc_or_ex_ss?: string;             // ss: Fire-ant testing arrangement
  s7_inc_or_ex_tt?: string;             // tt: Fire-ant testing/work costs
  s7_inc_or_ex_uu?: string;             // uu: QBCC Home Warranty Insurance
}

export function useContractInclusions() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveContractInclusions = async (
    contractId: string,
    inclusionsData: ContractInclusionsData
  ) => {
    setIsSubmitting(true);
    
    try {
      console.log('💾 Saving contract inclusions for contractId:', contractId);
      console.log('📋 Contract inclusions data:', inclusionsData);
      
      // Prepare data for pool_project_contract_inclusions_exclusions table
      // Only include fields that are explicitly provided (not undefined)
      // This prevents overwriting existing data when saving partial updates
      const dataToSave: any = {
        pool_project_contract_id: contractId,
      };

      // Only add fields that have actual values (not undefined, not empty string, not null)
      if (inclusionsData.s7_inc_or_ex_a && inclusionsData.s7_inc_or_ex_a.trim() !== '') {
        dataToSave.s7_inc_or_ex_a = inclusionsData.s7_inc_or_ex_a;
        console.log('🔍 Setting s7_inc_or_ex_a:', inclusionsData.s7_inc_or_ex_a, '→', dataToSave.s7_inc_or_ex_a);
      }
      // Only add fields that have actual values
      if (inclusionsData.s7_inc_or_ex_b && inclusionsData.s7_inc_or_ex_b.trim() !== '') {
        dataToSave.s7_inc_or_ex_b = inclusionsData.s7_inc_or_ex_b;
      }
      if (inclusionsData.s7_inc_or_ex_c && inclusionsData.s7_inc_or_ex_c.trim() !== '') {
        dataToSave.s7_inc_or_ex_c = inclusionsData.s7_inc_or_ex_c;
      }
      if (inclusionsData.s7_inc_or_ex_d && inclusionsData.s7_inc_or_ex_d.trim() !== '') {
        dataToSave.s7_inc_or_ex_d = inclusionsData.s7_inc_or_ex_d;
      }
      if (inclusionsData.s7_inc_or_ex_e && inclusionsData.s7_inc_or_ex_e.trim() !== '') {
        dataToSave.s7_inc_or_ex_e = inclusionsData.s7_inc_or_ex_e;
      }
      if (inclusionsData.s7_inc_or_ex_f && inclusionsData.s7_inc_or_ex_f.trim() !== '') {
        dataToSave.s7_inc_or_ex_f = inclusionsData.s7_inc_or_ex_f;
      }
      if (inclusionsData.s7_inc_or_ex_g && inclusionsData.s7_inc_or_ex_g.trim() !== '') {
        dataToSave.s7_inc_or_ex_g = inclusionsData.s7_inc_or_ex_g;
      }
      if (inclusionsData.s7_inc_or_ex_h && inclusionsData.s7_inc_or_ex_h.trim() !== '') {
        dataToSave.s7_inc_or_ex_h = inclusionsData.s7_inc_or_ex_h;
      }
      if (inclusionsData.s7_inc_or_ex_i && inclusionsData.s7_inc_or_ex_i.trim() !== '') {
        dataToSave.s7_inc_or_ex_i = inclusionsData.s7_inc_or_ex_i;
      }
      if (inclusionsData.s7_inc_or_ex_j && inclusionsData.s7_inc_or_ex_j.trim() !== '') {
        dataToSave.s7_inc_or_ex_j = inclusionsData.s7_inc_or_ex_j;
      }
      if (inclusionsData.s7_inc_or_ex_k && inclusionsData.s7_inc_or_ex_k.trim() !== '') {
        dataToSave.s7_inc_or_ex_k = inclusionsData.s7_inc_or_ex_k;
      }
      if (inclusionsData.s7_inc_or_ex_l && inclusionsData.s7_inc_or_ex_l.trim() !== '') {
        dataToSave.s7_inc_or_ex_l = inclusionsData.s7_inc_or_ex_l;
      }
      if (inclusionsData.s7_inc_or_ex_m && inclusionsData.s7_inc_or_ex_m.trim() !== '') {
        dataToSave.s7_inc_or_ex_m = inclusionsData.s7_inc_or_ex_m;
      }
      if (inclusionsData.s7_inc_or_ex_n && inclusionsData.s7_inc_or_ex_n.trim() !== '') {
        dataToSave.s7_inc_or_ex_n = inclusionsData.s7_inc_or_ex_n;
      }
      if (inclusionsData.s7_inc_or_ex_o && inclusionsData.s7_inc_or_ex_o.trim() !== '') {
        dataToSave.s7_inc_or_ex_o = inclusionsData.s7_inc_or_ex_o;
      }
      if (inclusionsData.s7_inc_or_ex_p && inclusionsData.s7_inc_or_ex_p.trim() !== '') {
        dataToSave.s7_inc_or_ex_p = inclusionsData.s7_inc_or_ex_p;
      }
      if (inclusionsData.s7_inc_or_ex_q && inclusionsData.s7_inc_or_ex_q.trim() !== '') {
        dataToSave.s7_inc_or_ex_q = inclusionsData.s7_inc_or_ex_q;
      }
      if (inclusionsData.s7_inc_or_ex_r && inclusionsData.s7_inc_or_ex_r.trim() !== '') {
        dataToSave.s7_inc_or_ex_r = inclusionsData.s7_inc_or_ex_r;
      }
      if (inclusionsData.s7_inc_or_ex_s && inclusionsData.s7_inc_or_ex_s.trim() !== '') {
        dataToSave.s7_inc_or_ex_s = inclusionsData.s7_inc_or_ex_s;
      }
      if (inclusionsData.s7_inc_or_ex_t && inclusionsData.s7_inc_or_ex_t.trim() !== '') {
        dataToSave.s7_inc_or_ex_t = inclusionsData.s7_inc_or_ex_t;
      }
      if (inclusionsData.s7_inc_or_ex_u && inclusionsData.s7_inc_or_ex_u.trim() !== '') {
        dataToSave.s7_inc_or_ex_u = inclusionsData.s7_inc_or_ex_u;
      }
      if (inclusionsData.s7_inc_or_ex_v && inclusionsData.s7_inc_or_ex_v.trim() !== '') {
        dataToSave.s7_inc_or_ex_v = inclusionsData.s7_inc_or_ex_v;
      }
      if (inclusionsData.s7_inc_or_ex_w && inclusionsData.s7_inc_or_ex_w.trim() !== '') {
        dataToSave.s7_inc_or_ex_w = inclusionsData.s7_inc_or_ex_w;
      }
      if (inclusionsData.s7_inc_or_ex_x && inclusionsData.s7_inc_or_ex_x.trim() !== '') {
        dataToSave.s7_inc_or_ex_x = inclusionsData.s7_inc_or_ex_x;
      }
      if (inclusionsData.s7_inc_or_ex_y && inclusionsData.s7_inc_or_ex_y.trim() !== '') {
        dataToSave.s7_inc_or_ex_y = inclusionsData.s7_inc_or_ex_y;
      }
      if (inclusionsData.s7_inc_or_ex_z && inclusionsData.s7_inc_or_ex_z.trim() !== '') {
        dataToSave.s7_inc_or_ex_z = inclusionsData.s7_inc_or_ex_z;
      }
      if (inclusionsData.s7_inc_or_ex_zz && inclusionsData.s7_inc_or_ex_zz.trim() !== '') {
        dataToSave.s7_inc_or_ex_zz = inclusionsData.s7_inc_or_ex_zz;
      }
      if (inclusionsData.s7_inc_or_ex_aa_plugin && inclusionsData.s7_inc_or_ex_aa_plugin.trim() !== '') {
        dataToSave.s7_inc_or_ex_aa_plugin = inclusionsData.s7_inc_or_ex_aa_plugin;
        console.log('🔌 Setting s7_inc_or_ex_aa_plugin:', inclusionsData.s7_inc_or_ex_aa_plugin);
      }
      if (inclusionsData.s7_inc_or_ex_bb && inclusionsData.s7_inc_or_ex_bb.trim() !== '') {
        dataToSave.s7_inc_or_ex_bb = inclusionsData.s7_inc_or_ex_bb;
      }
      if (inclusionsData.s7_inc_or_ex_cc && inclusionsData.s7_inc_or_ex_cc.trim() !== '') {
        dataToSave.s7_inc_or_ex_cc = inclusionsData.s7_inc_or_ex_cc;
      }
      if (inclusionsData.s7_inc_or_ex_dd && inclusionsData.s7_inc_or_ex_dd.trim() !== '') {
        dataToSave.s7_inc_or_ex_dd = inclusionsData.s7_inc_or_ex_dd;
      }
      if (inclusionsData.s7_inc_or_ex_ee && inclusionsData.s7_inc_or_ex_ee.trim() !== '') {
        dataToSave.s7_inc_or_ex_ee = inclusionsData.s7_inc_or_ex_ee;
      }
      if (inclusionsData.s7_inc_or_ex_ff && inclusionsData.s7_inc_or_ex_ff.trim() !== '') {
        dataToSave.s7_inc_or_ex_ff = inclusionsData.s7_inc_or_ex_ff;
      }
      if (inclusionsData.s7_inc_or_ex_gg && inclusionsData.s7_inc_or_ex_gg.trim() !== '') {
        dataToSave.s7_inc_or_ex_gg = inclusionsData.s7_inc_or_ex_gg;
      }
      if (inclusionsData.s7_inc_or_ex_hh && inclusionsData.s7_inc_or_ex_hh.trim() !== '') {
        dataToSave.s7_inc_or_ex_hh = inclusionsData.s7_inc_or_ex_hh;
      }
      if (inclusionsData.s7_inc_or_ex_jj && inclusionsData.s7_inc_or_ex_jj.trim() !== '') {
        dataToSave.s7_inc_or_ex_jj = inclusionsData.s7_inc_or_ex_jj;
      }
      if (inclusionsData.s7_inc_or_ex_kk && inclusionsData.s7_inc_or_ex_kk.trim() !== '') {
        dataToSave.s7_inc_or_ex_kk = inclusionsData.s7_inc_or_ex_kk;
      }
      if (inclusionsData.s7_inc_or_ex_ll && inclusionsData.s7_inc_or_ex_ll.trim() !== '') {
        dataToSave.s7_inc_or_ex_ll = inclusionsData.s7_inc_or_ex_ll;
      }
      if (inclusionsData.s7_inc_or_ex_mm && inclusionsData.s7_inc_or_ex_mm.trim() !== '') {
        dataToSave.s7_inc_or_ex_mm = inclusionsData.s7_inc_or_ex_mm;
      }
      if (inclusionsData.s7_inc_or_ex_nn && inclusionsData.s7_inc_or_ex_nn.trim() !== '') {
        dataToSave.s7_inc_or_ex_nn = inclusionsData.s7_inc_or_ex_nn;
      }
      if (inclusionsData.s7_inc_or_ex_oo && inclusionsData.s7_inc_or_ex_oo.trim() !== '') {
        dataToSave.s7_inc_or_ex_oo = inclusionsData.s7_inc_or_ex_oo;
      }
      if (inclusionsData.s7_inc_or_ex_pp && inclusionsData.s7_inc_or_ex_pp.trim() !== '') {
        dataToSave.s7_inc_or_ex_pp = inclusionsData.s7_inc_or_ex_pp;
      }
      if (inclusionsData.s7_inc_or_ex_qq && inclusionsData.s7_inc_or_ex_qq.trim() !== '') {
        dataToSave.s7_inc_or_ex_qq = inclusionsData.s7_inc_or_ex_qq;
      }
      if (inclusionsData.s7_inc_or_ex_rr && inclusionsData.s7_inc_or_ex_rr.trim() !== '') {
        dataToSave.s7_inc_or_ex_rr = inclusionsData.s7_inc_or_ex_rr;
      }
      if (inclusionsData.s7_inc_or_ex_ss && inclusionsData.s7_inc_or_ex_ss.trim() !== '') {
        dataToSave.s7_inc_or_ex_ss = inclusionsData.s7_inc_or_ex_ss;
      }
      if (inclusionsData.s7_inc_or_ex_tt && inclusionsData.s7_inc_or_ex_tt.trim() !== '') {
        dataToSave.s7_inc_or_ex_tt = inclusionsData.s7_inc_or_ex_tt;
      }
      if (inclusionsData.s7_inc_or_ex_uu && inclusionsData.s7_inc_or_ex_uu.trim() !== '') {
        dataToSave.s7_inc_or_ex_uu = inclusionsData.s7_inc_or_ex_uu;
      }

      console.log('📦 Final dataToSave object:', dataToSave);

      // Check if inclusions record already exists
      const { data: existing, error: checkError } = await (supabase as any)
        .from('pool_project_contract_inclusions_exclusions')
        .select('id')
        .eq('pool_project_contract_id', contractId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error checking existing contract inclusions:', checkError);
        throw checkError;
      }

      let response: any;
      
      if (existing) {
        // Update existing inclusions record
        console.log('🔄 Updating existing contract inclusions record');
        response = await (supabase as any)
          .from('pool_project_contract_inclusions_exclusions')
          .update(dataToSave)
          .eq('pool_project_contract_id', contractId)
          .select();
      } else {
        // Insert new inclusions record
        console.log('➕ Creating new contract inclusions record');
        response = await (supabase as any)
          .from('pool_project_contract_inclusions_exclusions')
          .insert(dataToSave)
          .select();
      }

      const { data, error } = response;

      if (error) {
        console.error('❌ Error saving contract inclusions:', error);
        throw error;
      }

      console.log('✅ Contract inclusions saved successfully:', data);

      toast({
        title: "Success!",
        description: existing 
          ? "Contract inclusions updated successfully." 
          : "Contract inclusions saved successfully.",
      });

      return { data, isUpdate: !!existing };

    } catch (error) {
      console.error('❌ Failed to save contract inclusions:', error);
      
      toast({
        title: "Error",
        description: "Failed to save contract inclusions. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadContractInclusions = async (contractId: string) => {
    setIsLoading(true);
    
    try {
      console.log('📖 Loading contract inclusions for contractId:', contractId);
      
      const { data, error } = await (supabase as any)
        .from('pool_project_contract_inclusions_exclusions')
        .select('*')
        .eq('pool_project_contract_id', contractId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error loading contract inclusions:', error);
        throw error;
      }

      if (!data) {
        console.log('📝 No contract inclusions found');
        return null;
      }

      console.log('✅ Contract inclusions loaded:', data);
      return data;

    } catch (error) {
      console.error('❌ Failed to load contract inclusions:', error);
      
      toast({
        title: "Error",
        description: "Failed to load contract inclusions.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveContractInclusions,
    loadContractInclusions,
    isSubmitting,
    isLoading
  };
}