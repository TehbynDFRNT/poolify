
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Pool, PoolProject } from "@/types/pool";
import { useToast } from "@/hooks/use-toast";

export const useCustomerData = (customerId: string | null) => {
  const [customer, setCustomer] = useState<PoolProject | null>(null);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(!!customerId);
  const { toast } = useToast();

  useEffect(() => {
    // If there's a customerId in the URL, fetch the customer data
    if (customerId) {
      fetchCustomerData(customerId);
      fetchPoolData(customerId);
    }
  }, [customerId]);
  
  const fetchCustomerData = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pool_projects')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setCustomer(data as PoolProject);
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      toast({
        title: "Error",
        description: "Failed to load customer data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPoolData = async (customerId: string) => {
    try {
      // First try to get directly from pool_projects table
      const { data: projectData, error: projectError } = await supabase
        .from('pool_projects')
        .select(`
          pool_specification_id,
          pool_color,
          pool_spec:pool_specification_id(*)
        `)
        .eq('id', customerId)
        .single();

      if (projectError) {
        console.error("Error fetching pool from pool_projects:", projectError);
        return;
      }
      
      if (projectData && projectData.pool_spec) {
        setSelectedPool(projectData.pool_spec as Pool);
        return;
      }

      // As a fallback, try the pool_selections table
      const { data: selectionData, error: selectionError } = await supabase
        .from('pool_selections')
        .select(`
          id,
          color,
          pool_id,
          pool:pool_id(*)
        `)
        .eq('customer_id', customerId)
        .single();

      if (selectionError) {
        // Not found error is expected if no selection exists
        if (selectionError.code !== 'PGRST116') {
          console.error("Error fetching pool selection:", selectionError);
        }
        return;
      }
      
      if (selectionData && selectionData.pool) {
        setSelectedPool(selectionData.pool as Pool);
      }
    } catch (error) {
      console.error("Error fetching pool data:", error);
    }
  };

  return { customer, selectedPool, loading };
};
