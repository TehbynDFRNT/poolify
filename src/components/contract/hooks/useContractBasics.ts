/**
 * Hook for managing contract basics data
 * Handles CRUD operations for pool_project_contract_basics table
 */
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContractBasicsData {
  resident_owner?: string;     // R1 values (Yes/No/N/A)
  finance_needed?: string;     // R1 values (Yes/No/N/A)
  lender_name?: string;
  work_period_days?: number;
  commencement_week?: string; // Date string in YYYY-MM-DD format
  weather_days?: number;
  weekends_public_holidays?: number;
}

export function useContractBasics() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveContractBasics = async (
    contractId: string,
    basicsData: ContractBasicsData
  ) => {
    setIsSubmitting(true);
    
    try {
      console.log('💾 Saving contract basics for contractId:', contractId);
      console.log('📋 Contract basics data:', basicsData);
      
      // Prepare data for pool_project_contract_basics table
      const dataToSave = {
        contract_id: contractId,
        resident_owner: basicsData.resident_owner || null,
        finance_needed: basicsData.finance_needed || null,
        lender_name: basicsData.lender_name || null,
        work_period_days: basicsData.work_period_days || null,
        commencement_week: basicsData.commencement_week || null,
        weather_days: basicsData.weather_days || null,
        weekends_public_holidays: basicsData.weekends_public_holidays || null,
      };

      // Check if contract basics record already exists
      const { data: existing, error: checkError } = await (supabase as any)
        .from('pool_project_contract_basics')
        .select('id')
        .eq('contract_id', contractId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error checking existing contract basics:', checkError);
        throw checkError;
      }

      let response: any;
      
      if (existing) {
        // Update existing contract basics record
        console.log('🔄 Updating existing contract basics record');
        response = await (supabase as any)
          .from('pool_project_contract_basics')
          .update(dataToSave)
          .eq('contract_id', contractId)
          .select();
      } else {
        // Insert new contract basics record
        console.log('➕ Creating new contract basics record');
        response = await (supabase as any)
          .from('pool_project_contract_basics')
          .insert(dataToSave)
          .select();
      }

      const { data, error } = response;

      if (error) {
        console.error('❌ Error saving contract basics:', error);
        throw error;
      }

      console.log('✅ Contract basics saved successfully:', data);

      toast({
        title: "Success!",
        description: existing 
          ? "Contract basics updated successfully." 
          : "Contract basics saved successfully.",
      });

      return { data, isUpdate: !!existing };

    } catch (error) {
      console.error('❌ Failed to save contract basics:', error);
      
      toast({
        title: "Error",
        description: "Failed to save contract basics. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadContractBasics = async (contractId: string) => {
    setIsLoading(true);
    
    try {
      console.log('📖 Loading contract basics for contractId:', contractId);
      
      const { data, error } = await (supabase as any)
        .from('pool_project_contract_basics')
        .select('*')
        .eq('contract_id', contractId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error loading contract basics:', error);
        throw error;
      }

      if (!data) {
        console.log('📝 No contract basics found');
        return null;
      }

      console.log('✅ Contract basics loaded:', data);
      return data;

    } catch (error) {
      console.error('❌ Failed to load contract basics:', error);
      
      toast({
        title: "Error",
        description: "Failed to load contract basics.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saveContractBasics,
    loadContractBasics,
    isSubmitting,
    isLoading
  };
}