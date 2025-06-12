/**
 * Hook for managing contract safety data
 * Handles CRUD operations for pool_project_contract_safety table
 */
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContractSafetyData {
  // Safety & Temporary Works fields
  tpc_tpsb?: string;           // Temporary pool safety barrier required? (R1 values: Yes/No/N/A)
  tpc_temporary_barrier_type?: string; // Type of temporary safety barrier (R5 values: Fence/Hard Cover)
  tpc_power_connection?: string; // Power connection (temp-works) (R1 values: Yes/No/N/A)
  tpc_hardcover?: string;      // Hard cover over pool shell required? (R1 values: Yes/No/N/A)
  tpc_ppsb?: string;           // Permanent pool safety barrier included? (R1 values: Yes/No/N/A)
  tpc_temp_fence?: string;     // Temporary fence supplied? (R1 values: Yes/No/N/A)
}

export function useContractSafety() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveContractSafety = async (
    contractId: string,
    safetyData: ContractSafetyData
  ) => {
    setIsSubmitting(true);
    
    try {
      console.log('💾 Saving contract safety for contractId:', contractId);
      console.log('📋 Contract safety data:', safetyData);
      
      // Prepare data for pool_project_contract_safety table
      // Only include fields that are explicitly provided (not undefined)
      // This prevents overwriting existing data when saving partial updates
      const dataToSave: any = {
        pool_project_contract_id: contractId,
      };

      // Only add fields that are explicitly provided (not undefined) to prevent data overwrites
      // For provided fields, empty strings become null, but undefined fields are not included at all
      if (safetyData.tpc_tpsb !== undefined) {
        dataToSave.tpc_tpsb = safetyData.tpc_tpsb || null;
      }
      if (safetyData.tpc_temporary_barrier_type !== undefined) {
        dataToSave.tpc_temporary_barrier_type = safetyData.tpc_temporary_barrier_type || null;
      }
      if (safetyData.tpc_power_connection !== undefined) {
        dataToSave.tpc_power_connection = safetyData.tpc_power_connection || null;
      }
      if (safetyData.tpc_hardcover !== undefined) {
        dataToSave.tpc_hardcover = safetyData.tpc_hardcover || null;
      }
      if (safetyData.tpc_ppsb !== undefined) {
        dataToSave.tpc_ppsb = safetyData.tpc_ppsb || null;
      }
      if (safetyData.tpc_temp_fence !== undefined) {
        dataToSave.tpc_temp_fence = safetyData.tpc_temp_fence || null;
      }

      // Check if safety record already exists
      const { data: existing, error: checkError } = await (supabase as any)
        .from('pool_project_contract_safety')
        .select('id')
        .eq('pool_project_contract_id', contractId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error checking existing contract safety:', checkError);
        throw checkError;
      }

      let response: any;
      
      if (existing) {
        // Update existing safety record
        console.log('🔄 Updating existing contract safety record');
        response = await (supabase as any)
          .from('pool_project_contract_safety')
          .update(dataToSave)
          .eq('pool_project_contract_id', contractId)
          .select();
      } else {
        // Insert new safety record
        console.log('➕ Creating new contract safety record');
        response = await (supabase as any)
          .from('pool_project_contract_safety')
          .insert(dataToSave)
          .select();
      }

      const { data, error } = response;

      if (error) {
        console.error('❌ Error saving contract safety:', error);
        throw error;
      }

      console.log('✅ Contract safety saved successfully:', data);

      toast({
        title: "Success!",
        description: existing 
          ? "Contract safety updated successfully." 
          : "Contract safety saved successfully.",
      });

      return { data, isUpdate: !!existing };

    } catch (error) {
      console.error('❌ Failed to save contract safety:', error);
      
      toast({
        title: "Error",
        description: "Failed to save contract safety. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadContractSafety = async (contractId: string) => {
    setIsLoading(true);
    
    try {
      console.log('📖 Loading contract safety for contractId:', contractId);
      
      const { data, error } = await (supabase as any)
        .from('pool_project_contract_safety')
        .select('*')
        .eq('pool_project_contract_id', contractId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error loading contract safety:', error);
        throw error;
      }

      if (!data) {
        console.log('📝 No contract safety found');
        return null;
      }

      console.log('✅ Contract safety loaded:', data);
      return data;

    } catch (error) {
      console.error('❌ Failed to load contract safety:', error);
      
      toast({
        title: "Error",
        description: "Failed to load contract safety.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveContractSafety,
    loadContractSafety,
    isSubmitting,
    isLoading
  };
}