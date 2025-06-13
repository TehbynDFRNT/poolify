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
  interest_rate?: number;      // Interest rate percentage
  work_period_days?: number;
  commencement_week?: string; // Date string in YYYY-MM-DD format
  weather_days?: number;
  weekends_public_holidays?: number;
  third_party_components?: string; // R1 values (Yes/No/N/A)
  total_delays?: number;      // Calculated field: weather_days + weekends_public_holidays
  // Additional date fields
  access_fencing_equipment_date?: string; // Date string in YYYY-MM-DD format
  specifications_date?: string; // Date string in YYYY-MM-DD format
  site_plan_date?: string; // Date string in YYYY-MM-DD format
  permission_to_enter_date?: string; // Date string in YYYY-MM-DD format
  other_date?: string; // Date string in YYYY-MM-DD format
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
      
      // Calculate total delays
      const weatherDays = basicsData.weather_days || 0;
      const weekendDays = basicsData.weekends_public_holidays || 0;
      const totalDelays = weatherDays + weekendDays;
      
      // Prepare data for pool_project_contract_basics table
      const dataToSave = {
        contract_id: contractId,
        resident_owner: basicsData.resident_owner || null,
        finance_needed: basicsData.finance_needed || null,
        lender_name: basicsData.lender_name || null,
        interest_rate: basicsData.interest_rate || null,
        work_period_days: basicsData.work_period_days || null,
        commencement_week: basicsData.commencement_week || null,
        weather_days: basicsData.weather_days || null,
        weekends_public_holidays: basicsData.weekends_public_holidays || null,
        third_party_components: basicsData.third_party_components || null,
        total_delays: totalDelays,
        // Additional date fields
        access_fencing_equipment_date: basicsData.access_fencing_equipment_date || null,
        specifications_date: basicsData.specifications_date || null,
        site_plan_date: basicsData.site_plan_date || null,
        permission_to_enter_date: basicsData.permission_to_enter_date || null,
        other_date: basicsData.other_date || null,
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