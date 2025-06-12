/**
 * Hook for managing contract extra costs data
 * Handles CRUD operations for pool_project_contract_extracosts table
 */
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContractExtraCostsData {
  // Extra-Cost Risk Flags (Item 8)
  rfc_q1_siteboundaries?: string;          // R1 values (Yes/No/N/A)
  rfc_q2_accessthesite?: string;           // R1 values (Yes/No/N/A)
  rfc_q3_ownerinterference?: string;       // R1 values (Yes/No/N/A)
  rfc_q4_primecost_variance?: string;      // R1 values (Yes/No/N/A)
  rfc_q5_statutory_variations?: string;    // R1 values (Yes/No/N/A)
  rfc_q6_commencement_delay?: string;      // R1 values (Yes/No/N/A)
  rfc_q7_latent_conditions?: string;       // R1 values (Yes/No/N/A)
  rfc_q8_works_suspension?: string;        // R1 values (Yes/No/N/A)
  rfc_q9_excavated_fill_dumping?: string;  // R1 values (Yes/No/N/A)
  rfc_q10_product_substitution?: string;   // R1 values (Yes/No/N/A)
  rfc_total_special_conditions?: string;   // R1 values (Yes/No/N/A)
  third_party_components?: string;         // R1 values (Yes/No/N/A)
}

export function useContractExtraCosts() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveContractExtraCosts = async (
    contractId: string,
    extraCostsData: ContractExtraCostsData
  ) => {
    setIsSubmitting(true);
    
    try {
      console.log('💾 Saving contract extra costs for contractId:', contractId);
      console.log('📋 Contract extra costs data:', extraCostsData);
      
      // Prepare data for pool_project_contract_extracosts table
      // Only include fields that are explicitly provided (not undefined)
      // This prevents overwriting existing data when saving partial updates
      const dataToSave: any = {
        pool_project_contract_id: contractId,
      };

      // Only add fields that are explicitly provided (not undefined) to prevent data overwrites
      // For provided fields, empty strings become null, but undefined fields are not included at all
      if (extraCostsData.rfc_q1_siteboundaries !== undefined) {
        dataToSave.rfc_q1_siteboundaries = extraCostsData.rfc_q1_siteboundaries || null;
      }
      if (extraCostsData.rfc_q2_accessthesite !== undefined) {
        dataToSave.rfc_q2_accessthesite = extraCostsData.rfc_q2_accessthesite || null;
      }
      if (extraCostsData.rfc_q3_ownerinterference !== undefined) {
        dataToSave.rfc_q3_ownerinterference = extraCostsData.rfc_q3_ownerinterference || null;
      }
      if (extraCostsData.rfc_q4_primecost_variance !== undefined) {
        dataToSave.rfc_q4_primecost_variance = extraCostsData.rfc_q4_primecost_variance || null;
      }
      if (extraCostsData.rfc_q5_statutory_variations !== undefined) {
        dataToSave.rfc_q5_statutory_variations = extraCostsData.rfc_q5_statutory_variations || null;
      }
      if (extraCostsData.rfc_q6_commencement_delay !== undefined) {
        dataToSave.rfc_q6_commencement_delay = extraCostsData.rfc_q6_commencement_delay || null;
      }
      if (extraCostsData.rfc_q7_latent_conditions !== undefined) {
        dataToSave.rfc_q7_latent_conditions = extraCostsData.rfc_q7_latent_conditions || null;
      }
      if (extraCostsData.rfc_q8_works_suspension !== undefined) {
        dataToSave.rfc_q8_works_suspension = extraCostsData.rfc_q8_works_suspension || null;
      }
      if (extraCostsData.rfc_q9_excavated_fill_dumping !== undefined) {
        dataToSave.rfc_q9_excavated_fill_dumping = extraCostsData.rfc_q9_excavated_fill_dumping || null;
      }
      if (extraCostsData.rfc_q10_product_substitution !== undefined) {
        dataToSave.rfc_q10_product_substitution = extraCostsData.rfc_q10_product_substitution || null;
      }
      if (extraCostsData.rfc_total_special_conditions !== undefined) {
        dataToSave.rfc_total_special_conditions = extraCostsData.rfc_total_special_conditions || null;
      }
      if (extraCostsData.third_party_components !== undefined) {
        dataToSave.third_party_components = extraCostsData.third_party_components || null;
      }

      // Check if extra costs record already exists
      const { data: existing, error: checkError } = await (supabase as any)
        .from('pool_project_contract_extracosts')
        .select('id')
        .eq('pool_project_contract_id', contractId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error checking existing contract extra costs:', checkError);
        throw checkError;
      }

      let response: any;
      
      if (existing) {
        // Update existing extra costs record
        console.log('🔄 Updating existing contract extra costs record');
        response = await (supabase as any)
          .from('pool_project_contract_extracosts')
          .update(dataToSave)
          .eq('pool_project_contract_id', contractId)
          .select();
      } else {
        // Insert new extra costs record
        console.log('➕ Creating new contract extra costs record');
        response = await (supabase as any)
          .from('pool_project_contract_extracosts')
          .insert(dataToSave)
          .select();
      }

      const { data, error } = response;

      if (error) {
        console.error('❌ Error saving contract extra costs:', error);
        throw error;
      }

      console.log('✅ Contract extra costs saved successfully:', data);

      toast({
        title: "Success!",
        description: existing 
          ? "Contract extra costs updated successfully." 
          : "Contract extra costs saved successfully.",
      });

      return { data, isUpdate: !!existing };

    } catch (error) {
      console.error('❌ Failed to save contract extra costs:', error);
      
      toast({
        title: "Error",
        description: "Failed to save contract extra costs. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadContractExtraCosts = async (contractId: string) => {
    setIsLoading(true);
    
    try {
      console.log('📖 Loading contract extra costs for contractId:', contractId);
      
      const { data, error } = await (supabase as any)
        .from('pool_project_contract_extracosts')
        .select('*')
        .eq('pool_project_contract_id', contractId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error loading contract extra costs:', error);
        throw error;
      }

      if (!data) {
        console.log('📝 No contract extra costs found');
        return null;
      }

      console.log('✅ Contract extra costs loaded:', data);
      return data;

    } catch (error) {
      console.error('❌ Failed to load contract extra costs:', error);
      
      toast({
        title: "Error",
        description: "Failed to load contract extra costs.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveContractExtraCosts,
    loadContractExtraCosts,
    isSubmitting,
    isLoading
  };
}