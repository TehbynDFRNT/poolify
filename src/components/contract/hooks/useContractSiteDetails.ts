/**
 * Hook for managing contract site details data
 * Handles CRUD operations for pool_project_contract_site_details table
 */
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContractSiteDetailsData {
  // Access & Site Conditions
  afe_item_2_sketch_provided?: string;      // R1 values (Yes/No/N/A)
  afe_min_access_width_mm?: number;
  afe_min_access_height_mm?: number;
  afe_crane_required?: string;              // R1 values (Yes/No/N/A)
  afe_min_crane_clearance_mm?: number;      // Minimum crane clearance in mm (conditional)
  afe_item_4_fnp_fences_near_access_path?: string; // R1 values (Yes/No/N/A)
  
  // Site Preparation & Excavation
  afe_item_6_tree_removal?: string;         // R1 values (Yes/No/N/A)
  afe_item_8_q1_overburden_preparation?: string;    // R2 values
  afe_item_8_q2_excavation_required?: string;       // R2 values
  afe_item_8_q3_excavation_method?: string;         // R3 values
  afe_exc_combo_size?: string;              // Excavator/Combo size (3T Excavator/5T Excavator)
  afe_item_8_q4_service_relocation?: string;        // S1 values (Yes/No/Unknown)
  afe_item_8_q5_service_relocation_party?: string;  // R2 values
  afe_item_8_q6_material_left_on_site?: string;     // R1 values (Yes/No/N/A)
  afe_item_8_q7_material_removed?: string;          // R1 values (Yes/No/N/A)
  afe_item_8_q8_excavated_removal_party?: string;   // R2 values
  
  // Responsibilities
  afe_item_4_rfm_removal_party?: string;            // R2 values
  afe_item_4_rrf_reinstatement_party?: string;      // R2 values
  afe_item_6_tree_removal_party?: string;           // R2 values
  afe_item_6_tree_replacement_party?: string;       // R2 values
  
  // Site Due-Diligence Notes
  afe_item_1_description_1_byd_findings?: string;
  afe_item_1_description_2_other_matters?: string;
  
  // Survey Reference
  datum_point_mm?: number;
}

export function useContractSiteDetails() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveContractSiteDetails = async (
    contractId: string,
    siteDetailsData: ContractSiteDetailsData
  ) => {
    setIsSubmitting(true);
    
    try {
      console.log('💾 Saving contract site details for contractId:', contractId);
      console.log('📋 Contract site details data:', siteDetailsData);
      
      // Prepare data for pool_project_contract_site_details table
      // Only include fields that are explicitly provided (not undefined)
      // This prevents overwriting existing data when saving partial updates
      const dataToSave: any = {
        pool_project_contract_id: contractId,
      };

      // Only add fields that are explicitly provided (not undefined) to prevent data overwrites
      // For provided fields, empty strings become null, but undefined fields are not included at all
      if (siteDetailsData.afe_item_2_sketch_provided !== undefined) {
        dataToSave.afe_item_2_sketch_provided = siteDetailsData.afe_item_2_sketch_provided || null;
      }
      if (siteDetailsData.afe_min_access_width_mm !== undefined) {
        dataToSave.afe_min_access_width_mm = (siteDetailsData.afe_min_access_width_mm === "" || siteDetailsData.afe_min_access_width_mm === null) ? null : siteDetailsData.afe_min_access_width_mm;
      }
      if (siteDetailsData.afe_min_access_height_mm !== undefined) {
        dataToSave.afe_min_access_height_mm = (siteDetailsData.afe_min_access_height_mm === "" || siteDetailsData.afe_min_access_height_mm === null) ? null : siteDetailsData.afe_min_access_height_mm;
      }
      if (siteDetailsData.afe_crane_required !== undefined) {
        dataToSave.afe_crane_required = siteDetailsData.afe_crane_required || null;
      }
      if (siteDetailsData.afe_min_crane_clearance_mm !== undefined) {
        dataToSave.afe_min_crane_clearance_mm = (siteDetailsData.afe_min_crane_clearance_mm === "" || siteDetailsData.afe_min_crane_clearance_mm === null) ? null : siteDetailsData.afe_min_crane_clearance_mm;
      }
      if (siteDetailsData.afe_item_4_fnp_fences_near_access_path !== undefined) {
        dataToSave.afe_item_4_fnp_fences_near_access_path = siteDetailsData.afe_item_4_fnp_fences_near_access_path || null;
      }
      if (siteDetailsData.afe_item_6_tree_removal !== undefined) {
        dataToSave.afe_item_6_tree_removal = siteDetailsData.afe_item_6_tree_removal || null;
      }
      if (siteDetailsData.afe_item_8_q1_overburden_preparation !== undefined) {
        dataToSave.afe_item_8_q1_overburden_preparation = siteDetailsData.afe_item_8_q1_overburden_preparation || null;
      }
      if (siteDetailsData.afe_item_8_q2_excavation_required !== undefined) {
        dataToSave.afe_item_8_q2_excavation_required = siteDetailsData.afe_item_8_q2_excavation_required || null;
      }
      if (siteDetailsData.afe_item_8_q3_excavation_method !== undefined) {
        dataToSave.afe_item_8_q3_excavation_method = siteDetailsData.afe_item_8_q3_excavation_method || null;
      }
      if (siteDetailsData.afe_exc_combo_size !== undefined) {
        dataToSave.afe_exc_combo_size = siteDetailsData.afe_exc_combo_size || null;
      }
      if (siteDetailsData.afe_item_8_q4_service_relocation !== undefined) {
        dataToSave.afe_item_8_q4_service_relocation = siteDetailsData.afe_item_8_q4_service_relocation || null;
      }
      if (siteDetailsData.afe_item_8_q5_service_relocation_party !== undefined) {
        dataToSave.afe_item_8_q5_service_relocation_party = siteDetailsData.afe_item_8_q5_service_relocation_party || null;
      }
      if (siteDetailsData.afe_item_8_q6_material_left_on_site !== undefined) {
        dataToSave.afe_item_8_q6_material_left_on_site = siteDetailsData.afe_item_8_q6_material_left_on_site || null;
      }
      if (siteDetailsData.afe_item_8_q7_material_removed !== undefined) {
        dataToSave.afe_item_8_q7_material_removed = siteDetailsData.afe_item_8_q7_material_removed || null;
      }
      if (siteDetailsData.afe_item_8_q8_excavated_removal_party !== undefined) {
        dataToSave.afe_item_8_q8_excavated_removal_party = siteDetailsData.afe_item_8_q8_excavated_removal_party || null;
      }
      if (siteDetailsData.afe_item_4_rfm_removal_party !== undefined) {
        dataToSave.afe_item_4_rfm_removal_party = siteDetailsData.afe_item_4_rfm_removal_party || null;
      }
      if (siteDetailsData.afe_item_4_rrf_reinstatement_party !== undefined) {
        dataToSave.afe_item_4_rrf_reinstatement_party = siteDetailsData.afe_item_4_rrf_reinstatement_party || null;
      }
      if (siteDetailsData.afe_item_6_tree_removal_party !== undefined) {
        dataToSave.afe_item_6_tree_removal_party = siteDetailsData.afe_item_6_tree_removal_party || null;
      }
      if (siteDetailsData.afe_item_6_tree_replacement_party !== undefined) {
        dataToSave.afe_item_6_tree_replacement_party = siteDetailsData.afe_item_6_tree_replacement_party || null;
      }
      if (siteDetailsData.afe_item_1_description_1_byd_findings !== undefined) {
        dataToSave.afe_item_1_description_1_byd_findings = siteDetailsData.afe_item_1_description_1_byd_findings || null;
      }
      if (siteDetailsData.afe_item_1_description_2_other_matters !== undefined) {
        dataToSave.afe_item_1_description_2_other_matters = siteDetailsData.afe_item_1_description_2_other_matters || null;
      }
      if (siteDetailsData.datum_point_mm !== undefined) {
        dataToSave.datum_point_mm = (siteDetailsData.datum_point_mm === "" || siteDetailsData.datum_point_mm === null) ? null : siteDetailsData.datum_point_mm;
      }

      // Check if site details record already exists
      const { data: existing, error: checkError } = await (supabase as any)
        .from('pool_project_contract_site_details')
        .select('id')
        .eq('pool_project_contract_id', contractId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error checking existing contract site details:', checkError);
        throw checkError;
      }

      let response: any;
      
      if (existing) {
        // Update existing site details record
        console.log('🔄 Updating existing contract site details record');
        response = await (supabase as any)
          .from('pool_project_contract_site_details')
          .update(dataToSave)
          .eq('pool_project_contract_id', contractId)
          .select();
      } else {
        // Insert new site details record
        console.log('➕ Creating new contract site details record');
        response = await (supabase as any)
          .from('pool_project_contract_site_details')
          .insert(dataToSave)
          .select();
      }

      const { data, error } = response;

      if (error) {
        console.error('❌ Error saving contract site details:', error);
        throw error;
      }

      console.log('✅ Contract site details saved successfully:', data);

      toast({
        title: "Success!",
        description: existing 
          ? "Contract site details updated successfully." 
          : "Contract site details saved successfully.",
      });

      return { data, isUpdate: !!existing };

    } catch (error) {
      console.error('❌ Failed to save contract site details:', error);
      
      toast({
        title: "Error",
        description: "Failed to save contract site details. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadContractSiteDetails = async (contractId: string) => {
    setIsLoading(true);
    
    try {
      console.log('📖 Loading contract site details for contractId:', contractId);
      
      const { data, error } = await (supabase as any)
        .from('pool_project_contract_site_details')
        .select('*')
        .eq('pool_project_contract_id', contractId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error loading contract site details:', error);
        throw error;
      }

      if (!data) {
        console.log('📝 No contract site details found');
        return null;
      }

      console.log('✅ Contract site details loaded:', data);
      return data;

    } catch (error) {
      console.error('❌ Failed to load contract site details:', error);
      
      toast({
        title: "Error",
        description: "Failed to load contract site details.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveContractSiteDetails,
    loadContractSiteDetails,
    isSubmitting,
    isLoading
  };
}