/**
 * Hook for managing contract special work data
 * Handles CRUD operations for pool_project_contract_special_work table
 * Shared by both SpecialWorkInstructionsSection and OwnerSuppliedItemsSection
 */
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContractSpecialWorkData {
  // Special Conditions (Schedule 1)
  special_considerations?: string;           // Special considerations (TEXT)
  
  // Special Work / Miscellaneous Equipment (Schedule 6)
  extra_special_notes?: string;              // Extra or special work details (TEXT)
  
  // Additional Access Work / Organisation Required (Schedule 8)
  special_access?: string;                   // Special access required (TEXT - Yes/No)
  special_access_notes?: string;             // Special access notes (TEXT)
  
  // Owner-Supplied Items
  c_item_17_osi_description_1?: string;      // Owner-supplied item #1 (TEXT)
  c_item_17_osi_description_2?: string;      // Owner-supplied item #2 (TEXT)
}

export function useContractSpecialWork() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveContractSpecialWork = async (
    contractId: string,
    specialWorkData: ContractSpecialWorkData
  ) => {
    setIsSubmitting(true);
    
    try {
      console.log('💾 Saving contract special work for contractId:', contractId);
      console.log('📋 Contract special work data:', specialWorkData);
      
      // Prepare data for pool_project_contract_special_work table
      // Only include fields that are explicitly provided (not undefined)
      // This prevents overwriting existing data when saving partial updates
      const dataToSave: any = {
        pool_project_contract_id: contractId,
      };

      // Only add fields that are explicitly provided (not undefined) to prevent data overwrites
      // For provided fields, empty strings become null, but undefined fields are not included at all
      if (specialWorkData.special_considerations !== undefined) {
        dataToSave.special_considerations = specialWorkData.special_considerations || null;
      }
      if (specialWorkData.extra_special_notes !== undefined) {
        dataToSave.extra_special_notes = specialWorkData.extra_special_notes || null;
      }
      if (specialWorkData.special_access !== undefined) {
        dataToSave.special_access = specialWorkData.special_access || null;
      }
      if (specialWorkData.special_access_notes !== undefined) {
        dataToSave.special_access_notes = specialWorkData.special_access_notes || null;
      }
      if (specialWorkData.c_item_17_osi_description_1 !== undefined) {
        dataToSave.c_item_17_osi_description_1 = specialWorkData.c_item_17_osi_description_1 || null;
      }
      if (specialWorkData.c_item_17_osi_description_2 !== undefined) {
        dataToSave.c_item_17_osi_description_2 = specialWorkData.c_item_17_osi_description_2 || null;
      }

      // Check if special work record already exists
      const { data: existing, error: checkError } = await (supabase as any)
        .from('pool_project_contract_special_work')
        .select('id')
        .eq('pool_project_contract_id', contractId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error checking existing contract special work:', checkError);
        throw checkError;
      }

      let response: any;
      
      if (existing) {
        // Update existing special work record
        console.log('🔄 Updating existing contract special work record');
        response = await (supabase as any)
          .from('pool_project_contract_special_work')
          .update(dataToSave)
          .eq('pool_project_contract_id', contractId)
          .select();
      } else {
        // Insert new special work record
        console.log('➕ Creating new contract special work record');
        response = await (supabase as any)
          .from('pool_project_contract_special_work')
          .insert(dataToSave)
          .select();
      }

      const { data, error } = response;

      if (error) {
        console.error('❌ Error saving contract special work:', error);
        throw error;
      }

      console.log('✅ Contract special work saved successfully:', data);

      toast({
        title: "Success!",
        description: existing 
          ? "Contract special work updated successfully." 
          : "Contract special work saved successfully.",
      });

      return { data, isUpdate: !!existing };

    } catch (error) {
      console.error('❌ Failed to save contract special work:', error);
      
      toast({
        title: "Error",
        description: "Failed to save contract special work. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadContractSpecialWork = async (contractId: string) => {
    setIsLoading(true);
    
    try {
      console.log('📖 Loading contract special work for contractId:', contractId);
      
      const { data, error } = await (supabase as any)
        .from('pool_project_contract_special_work')
        .select('*')
        .eq('pool_project_contract_id', contractId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error loading contract special work:', error);
        throw error;
      }

      if (!data) {
        console.log('📝 No contract special work found');
        return null;
      }

      console.log('✅ Contract special work loaded:', data);
      return data;

    } catch (error) {
      console.error('❌ Failed to load contract special work:', error);
      
      toast({
        title: "Error",
        description: "Failed to load contract special work.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveContractSpecialWork,
    loadContractSpecialWork,
    isSubmitting,
    isLoading
  };
}