/**
 * Hook for managing contract customer details
 * Handles saving customer information to pool_project_contract table
 * when in contract context vs pool_projects table when in pool builder context
 */
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContractCustomerDetails {
  owner1: string;
  owner2?: string;
  phone: string;
  email: string;
  home_address: string;
  site_address?: string;
  resident_homeowner: boolean;
}

export function useContractCustomerDetails() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const saveContractCustomerDetails = async (
    customerId: string,
    customerData: ContractCustomerDetails
  ) => {
    setIsSubmitting(true);
    
    try {
      console.log('🔗 Saving contract customer details for customerId:', customerId);
      console.log('📝 Contract customer data:', customerData);
      
      // Prepare data for pool_project_contract table
      const contractData = {
        id: customerId, // This is the FK to pool_projects.id
        owner1: customerData.owner1,
        owner2: customerData.owner2 || null,
        phone: customerData.phone,
        email: customerData.email,
        home_address: customerData.home_address,
        site_address: customerData.site_address || customerData.home_address,
        resident_homeowner: customerData.resident_homeowner,
      };

      // Check if contract record already exists
      const { data: existing, error: checkError } = await supabase
        .from('pool_project_contract')
        .select('id')
        .eq('id', customerId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error checking existing contract:', checkError);
        throw checkError;
      }

      let response;
      
      if (existing) {
        // Update existing contract record
        console.log('🔄 Updating existing contract record');
        response = await supabase
          .from('pool_project_contract')
          .update(contractData)
          .eq('id', customerId)
          .select();
      } else {
        // Insert new contract record
        console.log('➕ Creating new contract record');
        response = await supabase
          .from('pool_project_contract')
          .insert(contractData)
          .select();
      }

      const { data, error } = response;

      if (error) {
        console.error('❌ Error saving contract customer details:', error);
        throw error;
      }

      console.log('✅ Contract customer details saved successfully:', data);

      toast({
        title: "Success!",
        description: "Contract customer details saved successfully.",
      });

      return data;

    } catch (error) {
      console.error('❌ Failed to save contract customer details:', error);
      
      toast({
        title: "Error",
        description: "Failed to save contract customer details. Please try again.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadContractCustomerDetails = async (customerId: string) => {
    try {
      console.log('📖 Loading contract customer details for customerId:', customerId);
      
      const { data, error } = await supabase
        .from('pool_project_contract')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error loading contract customer details:', error);
        throw error;
      }

      if (!data) {
        console.log('📝 No contract customer details found, will use proposal details');
        return null;
      }

      console.log('✅ Contract customer details loaded:', data);
      return data;

    } catch (error) {
      console.error('❌ Failed to load contract customer details:', error);
      throw error;
    }
  };

  return {
    saveContractCustomerDetails,
    loadContractCustomerDetails,
    isSubmitting
  };
}