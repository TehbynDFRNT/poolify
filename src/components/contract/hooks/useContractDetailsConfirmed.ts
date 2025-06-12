/**
 * Hook to check if contract customer details have been confirmed
 * Checks for existence of a pool_project_contract row for the given customer ID
 */
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useContractDetailsConfirmed(customerId: string | null) {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkContractDetailsConfirmed = async () => {
      if (!customerId) {
        setIsConfirmed(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('🔍 Checking if contract details are confirmed for customerId:', customerId);
        
        const { data, error } = await supabase
          .from('pool_project_contract')
          .select('id')
          .eq('id', customerId)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('❌ Error checking contract details confirmation:', error);
          setError(error.message);
          setIsConfirmed(false);
          return;
        }

        const confirmed = !!data; // Convert to boolean - true if row exists
        setIsConfirmed(confirmed);
        
        console.log('✅ Contract details confirmation status:', { 
          customerId, 
          confirmed, 
          hasRow: !!data 
        });

      } catch (err) {
        console.error('❌ Unexpected error checking contract details confirmation:', err);
        setError('Failed to check contract details confirmation status');
        setIsConfirmed(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkContractDetailsConfirmed();
  }, [customerId]);

  // Function to manually refresh the confirmation status
  const refreshConfirmationStatus = async () => {
    if (!customerId) return;
    
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔄 Refreshing contract details confirmation status for:', customerId);
      
      const { data, error } = await supabase
        .from('pool_project_contract')
        .select('id')
        .eq('id', customerId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const confirmed = !!data;
      setIsConfirmed(confirmed);
      
      console.log('✅ Refreshed contract details confirmation status:', { customerId, confirmed });
      
      return confirmed;
    } catch (err) {
      console.error('❌ Error refreshing contract details confirmation:', err);
      setError('Failed to refresh confirmation status');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConfirmed,
    isLoading,
    error,
    refreshConfirmationStatus
  };
}