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
  // Production webhooks (Zapier) - will be used later
  production: {
    proposal: 'https://hooks.zapier.com/hooks/catch/16738664/3kfldc2/',
    contract: 'https://hooks.zapier.com/hooks/catch/16738664/38py2aj/',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)',
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
      "Owner 2 Phone": "", // Leave blank as requested
      "Owner 2 Email": "", // Leave blank as requested
      
      // Contract basics fields
      "C-Item 1 - Resident Owner": payload.contract_qa.contract_basics?.resident_owner || "",
      
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
      
      // Deposit breakdown (granular sub-items)
      "$PC - Deposit - BOD": Number(payload.financials.pc_contract_bod || 0).toFixed(2),
      "$PC - Deposit - Council Approvals": Number(payload.financials.form15_cost || 0).toFixed(2),
      "$PC - Deposit - HWI": Number(payload.financials.hwi_cost || 0).toFixed(2),
      
      // Direct duplicates of $C-Item equivalents
      "$PC - Shell Supply": Number(payload.financials.pool_shell_supply_total || 0).toFixed(2),
      "$PC - Excavation - A -Bobcat": Number(payload.financials.excavation_total || 0).toFixed(2),
      "$PC - Engineered Beam": Number(payload.financials.beam_cost || 0).toFixed(2),
      "$PC - EXTRA Concreting Works": Number(payload.financials.extra_concreting_total || 0).toFixed(2),
      "$PC - Special Inclusions": Number(payload.financials.special_inclusions || 0).toFixed(2),
      "$PC -Handover": Number(payload.financials.handover_total || 0).toFixed(2),
      
      // Shell Installation breakdown
      "$PC - Shell Install - B - Crane Hire": Number(payload.financials.pc_shell_install_crane_hire || 0).toFixed(2),
      "$PC -Shell Install- C - Backfill": Number(payload.financials.pc_shell_install_backfill || 0).toFixed(2),
      "$PC - Shell Install - D - All Other": Number(payload.financials.pc_shell_install_remainder || 0).toFixed(2),
      
      // Paving breakdown
      "$PC - Paving - A - Coping": Number(payload.financials.pc_paving_coping_supply || 0).toFixed(2),
      "$PC - Paving - A - Laying": Number(payload.financials.pc_paving_laying || 0).toFixed(2),
      
      // Retaining walls breakdown (splits the combined $C-Item total)
      "$PC - Retaining - DE2": Number(payload.financials.retaining_walls_cost || 0).toFixed(2),
      "$PC - Retaining  - Water Feature": Number(payload.financials.water_feature_cost || 0).toFixed(2),
      
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
      "Interest Rate": payload.financials.interest_rate?.toString() || "",
      "Third Party Components": payload.contract_qa.contract_basics?.third_party_components || "",
      "Access.Fencing, Equipment Date": payload.contract_qa.contract_basics?.access_fencing_equipment_date || "",
      "Specifications Date": payload.contract_qa.contract_basics?.specifications_date || "",
      "Site Plan Date": payload.contract_qa.contract_basics?.site_plan_date || "",
      "Permission to enter Date": payload.contract_qa.contract_basics?.permission_to_enter_date || "",
      "Other Date": payload.contract_qa.contract_basics?.other_date || "",
      
      // Special Conditions from special work instructions
      "Special Conditions": payload.contract_qa.special_work_instructions?.extra_special_notes || "",
      
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
      "AFE - Crane Required": payload.contract_qa.site_details?.afe_crane_required || "",
      "AFE - Crane Clearance": payload.contract_qa.site_details?.afe_min_crane_clearance_mm?.toString() || "",
      "AFE - EXC / Combo Size": payload.contract_qa.site_details?.afe_exc_combo_size || "",
      "AFE - Min Access Width": payload.contract_qa.site_details?.afe_min_access_width_mm?.toString() || "",
      "AFE - Min Access Height": payload.contract_qa.site_details?.afe_min_access_height_mm?.toString() || "",
      "AFE - Item 1 Description 1": payload.contract_qa.site_details?.afe_item_1_description_1_byd_findings || "",
      "AFE - Item 1 Description 2": payload.contract_qa.site_details?.afe_item_1_description_2_other_matters || "",
      "AFE - Item 2 - Sketch Provided": payload.contract_qa.site_details?.afe_item_2_sketch_provided || "",
      "AFE - Item 4 - FNP": payload.contract_qa.site_details?.afe_item_4_fnp_fences_near_access_path || "",
      "AFE - Item 4 - RFM": payload.contract_qa.site_details?.afe_item_4_rfm_removal_party || "",
      "AFE - Item 4 - RRF": payload.contract_qa.site_details?.afe_item_4_rrf_reinstatement_party || "",
      "AFE - Item 6 - Tree Removal": payload.contract_qa.site_details?.afe_item_6_tree_removal || "",
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
      "AFE -PSB Hire": payload.contract_qa.safety_temporary_works?.tpc_temp_fence === "Yes" ? "8" : "0",
      "AFE I10 - BCAT Mcharge": Number(payload.snapshot?.bobcat_cost || 0).toFixed(2),
      "AFE I10 - BCAT Rate": Number((payload.snapshot?.bobcat_cost || 0) / 8).toFixed(2),
      
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
      
      // C-Item 17 - Owner Supplied Items (OSI) from special considerations
      "C-Item 17 - OSI Description 1": payload.contract_qa.owner_supplied_items?.c_item_17_osi_description_1 || "",
      "C-Item 17 - OSI Description 2": payload.contract_qa.owner_supplied_items?.c_item_17_osi_description_2 || "",
      
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
    // Use test webhook for now
    const config = WEBHOOK_CONFIG.test;
    
    console.log('🚀 Posting to webhook:', config.url);
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