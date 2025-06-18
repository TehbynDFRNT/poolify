/**
 * Hook for submitting contract data to external webhook
 * Handles the complete contract submission workflow including data collection and posting
 */
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ProposalSnapshot } from '@/types/snapshot';
import type { PoolProject } from '@/types/pool';
import { useContractDataCollection, type ContractDataPayload } from './useContractDataCollection';

// Webhook configuration
const WEBHOOK_CONFIG = {
  // Test webhook (N8N) - for development
  test: {
    url: 'https://n8n.solarcompare.com/webhook-test/ecae75a4-acb1-4351-a224-76052b75d21a',
    headers: {
      'Content-Type': 'application/json',
    },
  },
  // Production webhook (N8N)
  production: {
    url: 'https://n8n.solarcompare.com/webhook/ecae75a4-acb1-4351-a224-76052b75d21a',
    headers: {
      'Content-Type': 'application/json',
    },
  },
};

export interface SubmissionResult {
  success: boolean;
  webhookResponse?: any;
  payload?: ContractDataPayload;
  error?: string;
  submissionId?: string;
}

export function useContractSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<SubmissionResult | null>(null);
  const { toast } = useToast();
  const { collectContractData, isCollecting } = useContractDataCollection();

  /**
   * Helper function to convert underscore_separated strings to Title Case
   */
  const toTitleCase = (str: string): string => {
    if (!str) return str;
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  /**
   * Transform collected data into webhook-compatible format
   * Maps to exact field names from contract-outputfields-raw.json
   */
  const transformPayloadForWebhook = useCallback((payload: ContractDataPayload) => {
    console.log('🔄 Transforming payload for webhook...');
    console.log('📋 Source customer data:', payload.customer);
    console.log('📋 Contract Q&A data:', payload.contract_qa);
    
    // Create test payload with exact field names from contract-outputfields-raw.json
    const webhookPayload = {
      // Customer information using exact expected field names
      "Owner 1 Name": payload.customer.owner1 || "",
      "Owner 2 Name": payload.customer.owner2 || "",
      "Home Address": payload.customer.home_address || "",
      "Site Address": payload.customer.site_address || payload.customer.home_address || "",
      "Owner 1 Phone": payload.customer.phone || "",
      "Owner 1 Email": payload.customer.email || "",
      "Owner 2 Phone": payload.customer.phone || "",
      "Owner 2 Email ": payload.customer.email || "",
      
      // Contract basics fields
      "C-Item 1 - Resident Owner": payload.customer.resident_homeowner ? "Yes" : "No",
      
      // Financial line items from contract summary (using exact field names, formatted to 2 decimal places)
      "$C-Item 3 - Deposit": Number(payload.financials.deposit_total || 0).toFixed(2),
      "$C-Item 3 - Shell Supply": Number(payload.financials.pool_shell_supply_total || 0).toFixed(2),
      "$C-Item 3 - Shell Installation": Number(payload.financials.pool_shell_installation_total || 0).toFixed(2),
      "$C-Item 3 - Excavation": Number(payload.financials.excavation_total || 0).toFixed(2),
      "$C-Item 3 - Engineered Beam": Number(payload.financials.beam_cost || 0).toFixed(2),
      "$C-Item 3 - Extra Concreting": Number(payload.financials.extra_concreting_total || 0).toFixed(2),
      "$C-Item 3 - Paving and Coping": Number(payload.financials.paving_total || 0).toFixed(2),
      "$C-Item 3 - Retaining - DE -WF": Number(payload.financials.retaining_walls_water_feature_total || 0).toFixed(2),
      "$C-Item 3 - Special Inclusions": Number(payload.financials.special_inclusions || 0).toFixed(2),
      "$C-Item 3 - Handover": Number(payload.financials.handover_total || 0).toFixed(2),
      "$C-Item 3 - Total": Number(payload.financials.contract_grand_total || 0).toFixed(2),
      
      // Contract price total (duplicates grand total)
      "$PC - Contract Price (inc)": Number(payload.financials.contract_grand_total || 0).toFixed(2),
      "$PC - Contract Discount Title": payload.financials.contract_discount_title || "",
      "$PC - Contract Discount Value": Number(payload.financials.contract_discount_value || 0).toFixed(2),
      "$PC - Contract Price (inc) After Discount": Number(payload.financials.contract_grand_total_after_discount || 0).toFixed(2),
      "Web Price": Number(payload.calculator?.totals?.basePoolTotal || 0).toFixed(2),
      
      // Deposit breakdown (granular sub-items)
      "$PC - Deposit - BOD": Number(payload.financials.pc_contract_bod || 0).toFixed(2),
      "$PC - Deposit - Council Approvals": Number(payload.financials.form15_cost || 0).toFixed(2),
      "$PC - Deposit - HWI": Number(payload.financials.hwi_cost || 0).toFixed(2),
      
      // Direct duplicates of $C-Item equivalents
      "$PC - Shell Supply ": Number(payload.financials.pool_shell_supply_total || 0).toFixed(2),
      "$PC - Shell Supply - After Discount": Number(payload.financials.pool_shell_supply_after_discount || 0).toFixed(2),
      "$PC - Supply - Equipment": Number(payload.financials.equipment_only || 0).toFixed(2),
      "$PC - Supply - Shell Only": Number(payload.financials.shell_value_in_contract || 0).toFixed(2),
      "$PC - Excavation Total": Number(payload.financials.excavation_total || 0).toFixed(2),
      "$PC - Excavation - CustomSiteRequirements": Number(payload.financials.custom_site_requirements_cost || 0).toFixed(2),
      "$PC - Excavation - Excavation Only": Number(payload.financials.excavation_only || 0).toFixed(2),
      "$PC - Engineered Beam": Number(payload.financials.beam_cost || 0).toFixed(2),
      "$PC - EXTRA Concreting Works": Number(payload.financials.extra_concreting_total || 0).toFixed(2),
      "$PC - SpecialInclusions - PostInstallEquipment": Number(payload.financials.post_installation_upgrades || 0).toFixed(2),
      "$PC - Special Inclusions": Number(payload.financials.custom_add_ons_cost || 0).toFixed(2),
      "$PC - SpecialInclusionsEquipment": Number(payload.financials.special_inclusions || 0).toFixed(2),
      "$PC -Handover": Number(payload.financials.handover_total || 0).toFixed(2),
      
      // Shell Installation breakdown
      "$PC - Shell Install - B - Crane Hire": Number(payload.financials.pc_shell_install_crane_hire || 0).toFixed(2),
      "$PC -Shell Install- C - Backfill": Number(payload.financials.pc_shell_install_backfill || 0).toFixed(2),
      "$PC - Shell Install - D - All Other": Number(payload.financials.pc_shell_install_remainder || 0).toFixed(2),
      
      // Paving breakdown
      "$PC - Paving - A - Coping": Number(payload.financials.pc_paving_coping_supply || 0).toFixed(2),
      "$PC - Paving - A - Laying": Number(payload.financials.pc_paving_laying || 0).toFixed(2),
      "$PC - Paving - ExtraPaving": Number(payload.financials.pc_paving_extra_paving || 0).toFixed(2),
      "$PC - Paving - ConcreteForPaving": Number(payload.financials.pc_paving_concrete_for_paving || 0).toFixed(2),
      
      // Retaining walls breakdown (splits the combined $C-Item total)
      "$PC - Retaining - DE2": Number(payload.financials.retaining_walls_cost || 0).toFixed(2),
      "$PC - Retaining - Water Feature": Number(payload.financials.water_feature_cost || 0).toFixed(2),
      
      // RFC Q&A fields (Yes/No/N/A values from extra costs section)
      "RFC - Q1": payload.contract_qa.extra_cost_risks?.rfc_q1_siteboundaries || "",
      "RFC - Q2": payload.contract_qa.extra_cost_risks?.rfc_q2_accessthesite || "",
      "RFC - Q3": payload.contract_qa.extra_cost_risks?.rfc_q3_ownerinterference || "",
      "RFC - Q4": payload.contract_qa.extra_cost_risks?.rfc_q4_primecost_variance || "",
      "RFC - Q5": payload.contract_qa.extra_cost_risks?.rfc_q5_statutory_variations || "",
      "RFC - Q6": payload.contract_qa.extra_cost_risks?.rfc_q6_commencement_delay || "",
      "RFC - Q7": payload.contract_qa.extra_cost_risks?.rfc_q7_latent_conditions || "",
      "RFC - Q8": payload.contract_qa.extra_cost_risks?.rfc_q8_works_suspension || "",
      "RFC - Q9": payload.contract_qa.extra_cost_risks?.rfc_q9_excavated_fill_dumping || "",
      "RFC - Q10": payload.contract_qa.extra_cost_risks?.rfc_q10_product_substitution || "",
      "RFC - Total": payload.contract_qa.extra_cost_risks?.rfc_total_special_conditions || "",
      
      // Contract basics fields
      "Finance Needed": payload.contract_qa.contract_basics?.finance_needed || "",
      "Lender Name": payload.contract_qa.contract_basics?.lender_name || "",
      "Commencement Week": payload.contract_qa.contract_basics?.commencement_week || "",
      "Work Period": payload.contract_qa.contract_basics?.work_period_days?.toString() || "",
      "Weather Days": payload.contract_qa.contract_basics?.weather_days?.toString() || "",
      "Weekends / Public Holidays": payload.contract_qa.contract_basics?.weekends_public_holidays?.toString() || "",
      "Total Delays Allowed": payload.financials.total_delays?.toString() || "",
      " Interest Rate": payload.financials.interest_rate?.toString() || "",
      "Third Party Components": payload.contract_qa.contract_basics?.third_party_components || "",
      "Access.Fencing, Equipment Date": payload.contract_qa.contract_basics?.access_fencing_equipment_date || "",
      "Specifications Date": payload.contract_qa.contract_basics?.specifications_date || "",
      "Site Plan Date": payload.contract_qa.contract_basics?.site_plan_date || "",
      "Permission to enter Date": payload.contract_qa.contract_basics?.permission_to_enter_date || "",
      "Other Date": payload.contract_qa.contract_basics?.other_date || "",
      
      // Schedule 1 - Special Conditions
      "Special Conditions": payload.contract_qa.special_work_instructions?.special_considerations || "N/A",
      
      // Schedule 6 - Special Work / Miscellaneous Equipment from special work instructions
      "AFE - Item 9 - Special Work": payload.contract_qa.special_work_instructions?.extra_special_notes || "N/A",
      "ExtraSpecialNotes": payload.contract_qa.special_work_instructions?.extra_special_notes || "N/A",
      
      // Schedule 8 - Additional Access Work / Organisation Required
      "Schedule 8 - Additional Access": payload.contract_qa.special_work_instructions?.special_access || "N/A",
      "Schedule 8 - Additional Access Notes": payload.contract_qa.special_work_instructions?.special_access_notes || "N/A",
      // TPC (Third Party Components) from safety and temporary works
      "TPC - TPSB": payload.contract_qa.safety_temporary_works?.tpc_tpsb || "",
      "TPC - PPSB": payload.contract_qa.safety_temporary_works?.tpc_ppsb || "",
      "TPC - Power Connection": payload.contract_qa.safety_temporary_works?.tpc_power_connection || "",
      "TPC - Temp Fence": payload.contract_qa.safety_temporary_works?.tpc_temp_fence || "",
      "TPC - Hardcover": payload.contract_qa.safety_temporary_works?.tpc_hardcover || "",
      "TPC Temp Pool Safety Barrier Name": payload.contract_qa.safety_temporary_works?.tpc_temporary_barrier_type || "",
      
      // TPC financial values from contract summary line items (margin-applied)
      "$TPC - Temp Pool Safety Barrier Value": Number(payload.financials.margin_applied_temp_safety_barrier_cost || 0).toFixed(2),
      "$TPC - Perm Pool Safety Barrier": Number(payload.snapshot?.fencing_total_cost || 0).toFixed(2),
      "$TPC - Power Connection Value": Number(payload.snapshot?.elec_total_cost || 0).toFixed(2),
      "$TPC - Total": Number(
        (payload.financials.margin_applied_temp_safety_barrier_cost || 0) +
        (payload.snapshot?.fencing_total_cost || 0) +
        (payload.snapshot?.elec_total_cost || 0)
      ).toFixed(2),
      
      // Fencing breakdown - Frameless Glass (FG) and Flat-Top Metal (FTM)
      "FG Metres": payload.snapshot?.glass_linear_meters?.toString() || "",
      "FG Gates": payload.snapshot?.glass_gates?.toString() || "",
      "FG Total": Number(payload.snapshot?.glass_total_cost || 0).toFixed(2),
      "FG Posts": "--",
      "FTM Metres": payload.snapshot?.metal_linear_meters?.toString() || "",
      "FTM Gates": payload.snapshot?.metal_gates?.toString() || "",
      "FTM Total": Number(payload.snapshot?.metal_total_cost || 0).toFixed(2),
      "FG Earthing": payload.snapshot?.glass_earthing_required ? "Yes" : "No",
      "FTM Earthing": payload.snapshot?.metal_earthing_required ? "Yes" : "No",
      
      // AFE (Access, Fencing, Equipment) from site details
      "AFE - Item 7 - Bobcat Needed": payload.contract_qa.site_details?.afe_item7_bobcat_needed || "",
      "AFE - Item 7 - Bobcat Size": payload.contract_qa.site_details?.afe_item7_bobcat_size || "",
      "AFE - Item 7 -Crane Needed": payload.contract_qa.site_details?.afe_item7_crane_needed || "",
      "AFE - Item 7 -Crane Size": payload.contract_qa.site_details?.afe_item7_crane_size || "",
      "AFE - Item 7 -Truck Needed": payload.contract_qa.site_details?.afe_item7_truck_needed || "",
      "AFE - Item 7 -Trucks #": payload.contract_qa.site_details?.afe_item7_trucks_num || "",
      "AFE - Item 7 -Trucks Size": payload.contract_qa.site_details?.afe_item7_trucks_size || "",
      "AFE - Item 7 - Mach Notes": payload.contract_qa.site_details?.afe_item7_mach_notes || "",
      "AFE - Crane Required": payload.contract_qa.site_details?.afe_crane_required || "",
      "AFE - Crane Clearance": payload.contract_qa.site_details?.afe_min_crane_clearance_mm?.toString() || "",
      "AFE - EXC / Combo Size": payload.contract_qa.site_details?.afe_exc_combo_size || "",
      "AFE - Min Access Width": payload.contract_qa.site_details?.afe_min_access_width_mm?.toString() || "",
      "AFE - Min Access Height": payload.contract_qa.site_details?.afe_min_access_height_mm?.toString() || "",
      "Datum Point": payload.contract_qa.site_details?.datum_point_mm?.toString() || "",
      "AFE - Item 1 Description 1": payload.contract_qa.site_details?.afe_item_1_description_1_byd_findings || "",
      "AFE - Item 1 Description 2": payload.contract_qa.site_details?.afe_item_1_description_2_other_matters || "",
      "AFE - Item 2 - Sketch Provided": payload.contract_qa.site_details?.afe_item_2_sketch_provided || "",
      "AFE - Item 4 - FNP": payload.contract_qa.site_details?.afe_item_4_fnp_fences_near_access_path || "",
      "AFE - Item 4 - RFM": payload.contract_qa.site_details?.afe_item_4_rfm_removal_party || "",
      "AFE - Item 4 - RRF": payload.contract_qa.site_details?.afe_item_4_rrf_reinstatement_party || "",
      "AFE - Item 6 - Tree Removal ": payload.contract_qa.site_details?.afe_item_6_tree_removal || "",
      "AFE - Item 6 - Tree Removal - Party": payload.contract_qa.site_details?.afe_item_6_tree_removal_party || "",
      "AFE - Item 6 - Tree Replacement - Party": payload.contract_qa.site_details?.afe_item_6_tree_replacement_party || "",
      "AFE - Item 8 - Q1": payload.contract_qa.site_details?.afe_item_8_q1_overburden_preparation || "",
      "AFE - Item 8 - Q2": payload.contract_qa.site_details?.afe_item_8_q2_excavation_required || "",
      "AFE - Item 8 - Q3": payload.contract_qa.site_details?.afe_item_8_q3_excavation_method || "",
      "AFE - Item 8 - Q4": payload.contract_qa.site_details?.afe_item_8_q4_service_relocation || "",
      "AFE - Item 8 - Q5": payload.contract_qa.site_details?.afe_item_8_q5_service_relocation_party || "",
      "AFE - Item 8 - Q6": payload.contract_qa.site_details?.afe_item_8_q6_material_left_on_site || "",
      "AFE - Item 8 - Q7": payload.contract_qa.site_details?.afe_item_8_q7_material_removed || "",
      "AFE - Item 8 - Q8": payload.contract_qa.site_details?.afe_item_8_q8_excavated_removal_party || "",
      "AFE -PSB Hire": payload.contract_qa.safety_temporary_works?.tpc_temp_barrier_hire_period_weeks?.toString() || "0",
      // AFE I10 - Equipment hire charges from site details
      "AFE I10 - EXC Rate": Number(payload.contract_qa.site_details?.afe_i10_exc_rate || 0).toFixed(2),
      "AFE I10 - EXC Mcharge": Number(payload.contract_qa.site_details?.afe_i10_exc_mcharge || 0).toFixed(2),
      "AFE I10 - Truck Rate": Number(payload.contract_qa.site_details?.afe_i10_truck_rate || 0).toFixed(2),
      "AFE I10 - Truck Mcharge": Number(payload.contract_qa.site_details?.afe_i10_truck_mcharge || 0).toFixed(2),
      "AFE I10 - Rock Rate": Number(payload.contract_qa.site_details?.afe_i10_rock_rate || 0).toFixed(2),
      "AFE I10 - Rock Mcharge": Number(payload.contract_qa.site_details?.afe_i10_rock_mcharge || 0).toFixed(2),
      "AFE I10 - Cartage Rate": Number(payload.contract_qa.site_details?.afe_i10_cartage_rate || 0).toFixed(2),
      "AFE I10 - Cartage Mcharge": Number(payload.contract_qa.site_details?.afe_i10_cartage_mcharge || 0).toFixed(2),
      "AFE I10 - Pipe Rate": Number(payload.contract_qa.site_details?.afe_i10_pipe_rate || 0).toFixed(2),
      "AFE I10 - Pipe Mcharge": Number(payload.contract_qa.site_details?.afe_i10_pipe_mcharge || 0).toFixed(2),
      "AFE I10 - SUPVIS Rate": Number(payload.contract_qa.site_details?.afe_i10_supvis_rate || 0).toFixed(2),
      "AFE I10 - SUPVIS Mcharge": Number(payload.contract_qa.site_details?.afe_i10_supvis_mcharge || 0).toFixed(2),
      "AFE I10 - BCAT Rate": Number(payload.contract_qa.site_details?.afe_i10_bcat_rate || 0).toFixed(2),
      "AFE I10 - BCAT Mcharge": Number(payload.contract_qa.site_details?.afe_i10_bcat_mcharge || 0).toFixed(2),
      
      // PCI (Prime Cost Items) breakdown
      "PCI -1 Description": payload.financials.pci_1_description || "",
      "PCI -1 Rate": Number(payload.financials.pci_1_rate || 0).toFixed(2),
      "PCI -1 QTY": payload.financials.pci_1_qty?.toString() || "",
      "PCI -1 Allowance": Number(payload.financials.pci_1_allowance || 0).toFixed(2),
      "PCI -2 Description": payload.financials.pci_2_description || "",
      "PCI -2 Rate": Number(payload.financials.pci_2_rate || 0).toFixed(2),
      "PCI -2 QTY": payload.financials.pci_2_qty?.toString() || "",
      "PCI -2 Allowance": Number(payload.financials.pci_2_allowance || 0).toFixed(2),
      "PCI Total": Number(payload.financials.pci_total || 0).toFixed(2),
      
      // C-Item 15 breakdown (excavation components)
      "$C-Item 15 -Excavation": Number(payload.financials.excavation_total || 0).toFixed(2),
      "$C-Item 15 - Crane Hire": Number(payload.financials.pc_shell_install_crane_hire || 0).toFixed(2),
      "$C-Item 15 - Backfill": Number(payload.financials.pc_shell_install_backfill || 0).toFixed(2),
      "$C-Item 15 - Total": Number((payload.financials.excavation_total || 0) + (payload.financials.pc_shell_install_crane_hire || 0) + (payload.financials.pc_shell_install_backfill || 0)).toFixed(2),
      
      // C-Item 16 - Construction margin percentage
      "C-Item 16 - Con Marg %": payload.snapshot?.pool_margin_pct?.toString() || "",
      
      // C-Item 17 - Owner Supplied Items (OSI) from special work instructions
      "C-Item 17 - OSI Description 1": payload.contract_qa.special_work_instructions?.c_item_17_osi_description_1 || "",
      "C-Item 17 - OSI Description 2": payload.contract_qa.special_work_instructions?.c_item_17_osi_description_2 || "",
      
      // Pool Description from snapshot
      "Pool Description": payload.snapshot?.spec_name || "",
      "Pool Colour": payload.snapshot?.pool_color || "",
      
      // Pool dimensions from snapshot
      "Internal Length": payload.snapshot?.spec_length_m?.toString() || "",
      "Internal Width": payload.snapshot?.spec_width_m?.toString() || "",
      "Depth - Deep End": payload.snapshot?.spec_depth_deep_m?.toString() || "",
      "Depth Shallow End": payload.snapshot?.spec_depth_shallow_m?.toString() || "",
      
      // Pool equipment from snapshot
      "Pool Pump": payload.snapshot?.pump_name || "",
      "Sanitiser": payload.snapshot?.sanitiser_name || "",
      "Pool Filter": payload.snapshot?.filter_name || "",
      "Lights": payload.snapshot?.light_model || "",
      "Robotic Cleaner": payload.snapshot?.cleaner_included ? "Yes" : "No",
      "Pool Cleaner Model": payload.snapshot?.cleaner_name || "",
      "Minerals Included": payload.snapshot?.handover_components?.some(component => 
        component.hk_component_name === "15KG Enhance Minerals"
      ) ? "Yes" : "No",
      "Handover Kit": payload.snapshot?.handover_package_name || "",
      "Spa Jets": payload.snapshot?.selected_extras_json?.find(extra => 
        extra.type === "Spa Jets"
      )?.name || "N/A",
      "No of Spa Jets": payload.snapshot?.selected_extras_json?.find(extra => 
        extra.type === "Spa Jets"
      )?.quantity?.toString() || "N/A",
      "Pepper Pots": payload.snapshot?.selected_extras_json?.find(extra => 
        extra.name === "Pepper Pots"
      )?.name || "N/A",
      "No of Pepper Pots": payload.snapshot?.selected_extras_json?.find(extra => 
        extra.name === "Pepper Pots"
      )?.quantity?.toString() || "N/A",
      "Quantum Purity": payload.snapshot?.selected_extras_json?.find(extra => 
        extra.name === "Quantum UV Sanitation"
      )?.name || "N/A",
      "Deck Jets": (() => {
        const deckJetsExtra = payload.snapshot?.selected_extras_json?.find(extra => 
          extra.type === "Deck Jets"
        );
        return deckJetsExtra ? deckJetsExtra.type : "N/A";
      })(),
      "No of Deck Jets": (() => {
        const deckJetsExtra = payload.snapshot?.selected_extras_json?.find(extra => 
          extra.type === "Deck Jets"
        );
        if (!deckJetsExtra) return "N/A";
        // Extract quantity from name like 'Deck Jets x 2' or 'Deck Jets x 4'
        const match = deckJetsExtra.name.match(/x\s*(\d+)/);
        return match ? match[1] : "N/A";
      })(),
      "Hand Grab Rail": payload.snapshot?.selected_extras_json?.find(extra => 
        extra.type === "Hand Grab Rail"
      )?.name || "N/A",
      "Pool Plus Manager": (() => {
        // Check for bundle first - if bundle exists, it represents both automation and chemistry
        const bundleExtra = payload.snapshot?.selected_extras_json?.find(extra => 
          extra.type === "Bundle"
        );
        if (bundleExtra) return bundleExtra.name;
        
        // Otherwise check for individual automation/chemistry selections
        const automationExtra = payload.snapshot?.selected_extras_json?.find(extra => 
          extra.type === "Automation"
        );
        const chemistryExtra = payload.snapshot?.selected_extras_json?.find(extra => 
          extra.type === "Chemistry"
        );
        
        // Build combined name based on what's selected
        if (automationExtra && chemistryExtra) {
          return `${automationExtra.name} + ${chemistryExtra.name}`;
        } else if (automationExtra) {
          return automationExtra.name;
        } else if (chemistryExtra) {
          return chemistryExtra.name;
        }
        
        return "N/A";
      })(),
      "Lighting Upgrade": (() => {
        const ledLightExtra = payload.snapshot?.selected_extras_json?.find(extra => 
          extra.general_extra_id === "841f0324-4989-4542-b24d-a25e1874912e" || 
          (extra.name?.includes("LED") && extra.type === "Misc")
        );
        return ledLightExtra ? "Yes" : "No";
      })(),
      "No of Lights": (() => {
        const ledLightExtra = payload.snapshot?.selected_extras_json?.find(extra => 
          extra.general_extra_id === "841f0324-4989-4542-b24d-a25e1874912e" || 
          (extra.name?.includes("LED") && extra.type === "Misc")
        );
        // Base 1 light + any additional from the extra
        return ledLightExtra ? (1 + (ledLightExtra.quantity || 0)).toString() : "1";
      })(),
      
      // Heating and thermal blanket fields from snapshot
      "Heating Provisions": payload.snapshot?.include_heat_pump ? "Yes" : "No",
      "HP Type": payload.snapshot?.include_heat_pump ? (payload.snapshot?.heat_pump_sku || "") : "N/A",
      "Heating Description": payload.snapshot?.include_heat_pump ? (payload.snapshot?.heat_pump_description || "") : "N/A",
      "Thermal Blankets": payload.snapshot?.include_blanket_roller ? "Yes" : "No",
      "Roller": payload.snapshot?.include_blanket_roller ? (payload.snapshot?.blanket_roller_description || "") : "N/A",
      
      // Water feature fields from snapshot
      "Water Feature": (payload.snapshot?.water_feature_total_cost && payload.snapshot.water_feature_total_cost > 0) ? "Yes" : "No",
      "WF Size": toTitleCase(payload.snapshot?.water_feature_size || ""),
      "WF Front": toTitleCase(payload.snapshot?.water_feature_front_finish || ""),
      "WF Top": toTitleCase(payload.snapshot?.water_feature_top_finish || ""),
      "WF Sides": toTitleCase(payload.snapshot?.water_feature_sides_finish || ""),
      "WF Back Cladding": payload.snapshot?.water_feature_back_cladding_needed ? "Yes" : "No",
      "WF Blade": payload.snapshot?.water_feature_led_blade || "",
      
      // Retaining walls fields from snapshot (up to 4 walls)
      "Ret-Wall-1-YN": payload.snapshot?.retaining_walls_json?.[0] ? "Yes" : "No",
      "Ret-Wall-1-Length": payload.snapshot?.retaining_walls_json?.[0]?.length?.toString() || "N/A",
      "Ret-Wall-1-Height1": payload.snapshot?.retaining_walls_json?.[0]?.height1?.toString() || "N/A",
      "Ret-Wall-1-Height2": payload.snapshot?.retaining_walls_json?.[0]?.height2?.toString() || "N/A",
      "Ret-Wall-1-Material": payload.snapshot?.retaining_walls_json?.[0]?.wall_type || "N/A",
      "Ret-Wall-1-PaintColour": "N/A",
      "Ret-Wall-1-CladdingStyle": "N/A",
      "Ret-Wall-2-YN": payload.snapshot?.retaining_walls_json?.[1] ? "Yes" : "No",
      "Ret-Wall-2-Length": payload.snapshot?.retaining_walls_json?.[1]?.length?.toString() || "N/A",
      "Ret-Wall-2-Height1": payload.snapshot?.retaining_walls_json?.[1]?.height1?.toString() || "N/A",
      "Ret-Wall-2-Height2": payload.snapshot?.retaining_walls_json?.[1]?.height2?.toString() || "N/A",
      "Ret-Wall-2-Material": payload.snapshot?.retaining_walls_json?.[1]?.wall_type || "N/A",
      "Ret-Wall-2-PaintColour": "N/A",
      "Ret-Wall-2-CladdingStyle": "N/A",
      "Ret-Wall-3-YN": payload.snapshot?.retaining_walls_json?.[2] ? "Yes" : "No",
      "Ret-Wall-3-Length": payload.snapshot?.retaining_walls_json?.[2]?.length?.toString() || "N/A",
      "Ret-Wall-3-Height1": payload.snapshot?.retaining_walls_json?.[2]?.height1?.toString() || "N/A",
      "Ret-Wall-3-Height2": payload.snapshot?.retaining_walls_json?.[2]?.height2?.toString() || "N/A",
      "Ret-Wall-3-Material": payload.snapshot?.retaining_walls_json?.[2]?.wall_type || "N/A",
      "Ret-Wall-3-PaintColour": "N/A",
      "Ret-Wall-3-CladdingStyle": "N/A",
      "Ret-Wall-4-YN": payload.snapshot?.retaining_walls_json?.[3] ? "Yes" : "No",
      "Ret-Wall-4-Length": payload.snapshot?.retaining_walls_json?.[3]?.length?.toString() || "N/A",
      "Ret-Wall-4-Height1": payload.snapshot?.retaining_walls_json?.[3]?.height1?.toString() || "N/A",
      "Ret-Wall-4-Height2": payload.snapshot?.retaining_walls_json?.[3]?.height2?.toString() || "N/A",
      "Ret-Wall-4-Material": payload.snapshot?.retaining_walls_json?.[3]?.wall_type || "N/A",
      "Ret-Wall-4-PaintColour": "N/A",
      "Ret-Wall-4-CladdingStyle": "N/A",
      
      // Coping fields from snapshot
      "Coping Category": payload.snapshot?.coping_category || "N/A",
      "Coping Paving": (payload.snapshot?.pc_coping_supply && payload.snapshot.pc_coping_supply > 0) ? "Yes" : "No",
      "Quad Skimmer Lid": "Yes",
      "Extra Concreting": (payload.snapshot?.extra_concreting_cost && payload.snapshot.extra_concreting_cost > 0) ? "Yes" : "No",
      
      // Paving fields from snapshot
      "Paving Includes": (payload.snapshot?.extra_paving_sqm && payload.snapshot.extra_paving_sqm > 0) ? "Yes" : "N/A",
      "Paving Type": payload.snapshot?.extra_paving_name || "",
      "Paving Area": payload.snapshot?.extra_paving_sqm?.toString() || "",
      
      // Concrete pump from snapshot
      "Concrete Pump": payload.snapshot?.concrete_pump_needed ? "Yes" : "No",
      "Concrete Pump Total": Number(payload.snapshot?.concrete_pump_total_cost || 0).toFixed(2),
      
      // Extra concreting type from snapshot
      "Extra Concreting Type": payload.snapshot?.extra_concreting_name || "",
      
      // ECFA (Extra Concreting Floor Area) from snapshot
      "ECFA": payload.snapshot?.extra_concreting_sqm?.toString() || "",
      
      // Extra concreting finish options from snapshot
      "Extra Concreting Finish 1": payload.snapshot?.extra_concrete_finish_one || "",
      "Extra Concreting Finish 2": payload.snapshot?.extra_concrete_finish_two || "",
      
      // Grout colour from snapshot
      "Grout Colour": payload.snapshot?.grout_colour || "",
      
      // Recess draining from snapshot
      "Recess Drainage": payload.snapshot?.recess_drainage || "",
      
      // Media Filter from misc extras
      "Media Filter": payload.snapshot?.selected_extras_json?.find(extra => 
        extra.general_extra_id === "00885df8-b6bd-4d38-af1d-68a325efca4a" || 
        (extra.sku === "THERA6255" && extra.type === "Misc")
      )?.name || "N/A",
      
      // Extra paving fields from snapshot
      "Extra Paving": (payload.snapshot?.existing_paving_cost && payload.snapshot.existing_paving_cost > 0) ? "Yes" : "No",
      "Extra Paving Area": payload.snapshot?.existing_paving_sqm?.toString() || "N/A",
      "Extra Paving Type": payload.snapshot?.existing_paving_name || "N/A",
      
      // Under-fence concrete strips from enriched data
      "UFCSMeter": payload.snapshot?.uf_strips_data?.reduce((total, strip) => total + strip.length, 0)?.toString() || "0",
      "UFCSType": payload.snapshot?.uf_strips_data?.map(strip => strip.type).join(", ") || "N/A",
      
      // S7 - Schedule 3: Inclusions & Exclusions from contract inclusions
      "S7-Inc or EX - (a)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_a || "",
      "S7-Inc or EX - (b)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_b || "",
      "S7-Inc or EX - (c)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_c || "",
      "S7-Inc or EX - (d)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_d || "",
      "S7-Inc or EX - (e)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_e || "",
      "S7-Inc or EX - (f)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_f || "",
      "S7-Inc or EX - (g)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_g || "",
      "S7-Inc or EX - (h)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_h || "",
      "S7-Inc or EX - (i)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_i || "",
      "S7-Inc or EX - (j)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_j || "",
      "S7-Inc or EX - (k)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_k || "",
      "S7-Inc or EX - (l)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_l || "",
      "S7-Inc or EX - (m)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_m || "",
      "S7-Inc or EX - (n)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_n || "",
      "S7-Inc or EX - (o)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_o || "",
      "S7-Inc or EX - (p)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_p || "",
      "S7-Inc or EX - (q)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_q || "",
      "S7-Inc or EX - (r)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_r || "",
      "S7-Inc or EX - (s)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_s || "",
      "S7-Inc or EX - (t)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_t || "",
      "S7-Inc or EX - (u)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_u || "",
      "S7-Inc or EX - (v)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_v || "",
      "S7-Inc or EX - (w)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_w || "",
      "S7-Inc or EX - (x)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_x || "",
      "S7-Inc or EX - (y)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_y || "",
      "S7-Inc or EX - (z)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_z || "",
      "S7-Inc or EX - aa Plugin": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_aa_plugin || "",
      "S7-Inc or EX - (bb)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_bb || "",
      "S7-Inc or EX - (cc)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_cc || "",
      "S7-Inc or EX - (dd)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_dd || "",
      "S7-Inc or EX - (ee)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_ee || "",
      "S7-Inc or EX - (ff)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_ff || "",
      "S7-Inc or EX - (gg)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_gg || "",
      "S7-Inc or EX - (hh)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_hh || "",
      "S7-Inc or EX - (jj)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_jj || "",
      "S7-Inc or EX - (kk)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_kk || "",
      "S7-Inc or EX - (ll)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_ll || "",
      "S7-Inc or EX - (mm)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_mm || "",
      "S7-Inc or EX - (nn)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_nn || "",
      "S7-Inc or EX - (oo)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_oo || "",
      "S7-Inc or EX - (pp)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_pp || "",
      "S7-Inc or EX - (qq)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_qq || "",
      "S7-Inc or EX - (rr)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_rr || "",
      "S7-Inc or EX - (ss)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_ss || "",
      "S7-Inc or EX - (tt)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_tt || "",
      "S7-Inc or EX - (uu)": payload.contract_qa.inclusions_exclusions?.s7_inc_or_ex_uu || "",
      
      // Add metadata for debugging
      "_metadata": {
        submission_timestamp: payload.metadata.submission_timestamp,
        submission_type: payload.metadata.submission_type,
        customer_id: payload.customer.id,
        version: payload.metadata.version
      }
    };
    
    console.log('✅ Webhook payload created:', webhookPayload);
    
    return webhookPayload;
  }, []);

  /**
   * Post data to webhook endpoint
   */
  const postToWebhook = useCallback(async (webhookPayload: any): Promise<SubmissionResult> => {
    // Check URL parameters to determine if test mode
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.get('test') === 'true';
    
    // Use appropriate N8N webhook based on test parameter
    const config = isTestMode ? WEBHOOK_CONFIG.test : WEBHOOK_CONFIG.production;
    const webhookType = isTestMode ? 'TEST' : 'PRODUCTION';
    
    console.log(`🚀 Posting to N8N ${webhookType} webhook:`, config.url);
    console.log('📦 Payload size:', JSON.stringify(webhookPayload).length, 'characters');
    
    try {
      const response = await fetch(config.url, {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify(webhookPayload),
      });
      
      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status} ${response.statusText}`);
      }
      
      const responseData = await response.json().catch(() => response.text());
      
      console.log('✅ Webhook response:', responseData);
      
      return {
        success: true,
        webhookResponse: responseData,
        submissionId: `submission_${Date.now()}`, // Generate a simple ID
      };
      
    } catch (error) {
      console.error('❌ Webhook submission failed:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown webhook error',
      };
    }
  }, []);

  /**
   * Submit contract data to webhook
   * Complete workflow: collect data → transform → post to webhook
   */
  const submitContract = useCallback(async (
    customer: PoolProject,
    snapshot: ProposalSnapshot | null,
    lineItems: any,
    calculatorData: any
  ): Promise<SubmissionResult> => {
    if (isSubmitting || isCollecting) {
      console.warn('⚠️ Submission already in progress');
      return { success: false, error: 'Submission already in progress' };
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('🎯 Starting contract submission workflow...');
      console.log('👤 Customer:', customer.owner1, customer.id);
      console.log('📊 Has snapshot:', !!snapshot);
      
      // Step 1: Collect all contract data
      console.log('📋 Step 1: Collecting contract data...');
      const contractData = await collectContractData(customer, snapshot, lineItems, calculatorData);
      
      // Step 2: Transform for webhook
      console.log('🔄 Step 2: Transforming data for webhook...');
      const webhookPayload = transformPayloadForWebhook(contractData);
      
      // Step 3: Post to webhook
      console.log('🚀 Step 3: Posting to webhook...');
      const result = await postToWebhook(webhookPayload);
      
      // Include the payload in the result for debugging
      const finalResult = {
        ...result,
        payload: contractData,
      };
      
      setLastSubmission(finalResult);
      
      if (result.success) {
        console.log('🎉 Contract submission successful!');
        
        toast({
          title: "Contract Submitted Successfully!",
          description: `Contract for ${customer.owner1} has been submitted to the webhook.`,
        });
      } else {
        console.error('💥 Contract submission failed:', result.error);
        
        toast({
          title: "Submission Failed",
          description: result.error || "An unknown error occurred during submission.",
          variant: "destructive",
        });
      }
      
      return finalResult;
      
    } catch (error) {
      console.error('💥 Contract submission workflow failed:', error);
      
      const errorResult: SubmissionResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown submission error',
      };
      
      setLastSubmission(errorResult);
      
      toast({
        title: "Submission Error",
        description: "Failed to submit contract. Please try again.",
        variant: "destructive",
      });
      
      return errorResult;
      
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, isCollecting, collectContractData, transformPayloadForWebhook, postToWebhook, toast]);

  /**
   * Reset submission state
   */
  const resetSubmission = useCallback(() => {
    setLastSubmission(null);
  }, []);

  return {
    // Main submission function
    submitContract,
    
    // State
    isSubmitting: isSubmitting || isCollecting,
    lastSubmission,
    
    // Utilities
    resetSubmission,
    
    // Webhook configuration (for debugging)
    webhookConfig: WEBHOOK_CONFIG,
  };
}