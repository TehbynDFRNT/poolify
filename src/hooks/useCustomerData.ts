import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pool, PoolProject } from "@/types/pool";
import { useEffect, useState } from "react";

export const useCustomerData = (customerId: string | null) => {
  const [customer, setCustomer] = useState<PoolProject | null>(null);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [loading, setLoading] = useState(!!customerId);
  const { toast } = useToast();

  const fetchCustomerData = async (id: string) => {
    console.log("useCustomerData: fetchCustomerData called with id:", id);
    try {
      const { data, error } = await supabase
        .from('pool_projects')
        .select(`
          *,
          pool_retaining_walls(*),
          pool_concrete_selections(*),
          pool_paving_selections(*),
          pool_fence_concrete_strips(*),
          pool_equipment_selections(
            *,
            crane:crane_id(*),
            traffic_control:traffic_control_id(*),
            bobcat:bobcat_id(*)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error("useCustomerData: Error fetching customer:", error);
        toast({
          title: "Error",
          description: "Failed to load customer data. Please try again.",
          variant: "destructive"
        });
        setCustomer(null); // Ensure customer is null on error
        // Not re-throwing error here to allow finally block to run setLoading(false)
        return; // Exit if error
      }

      if (data) {
        console.log("useCustomerData: Customer data fetched successfully:", data);
        setCustomer(data as PoolProject);
      } else {
        console.warn("useCustomerData: No customer data returned but no error from Supabase for ID:", id);
        setCustomer(null);
      }
    } catch (error) {
      console.error("useCustomerData: Catch block in fetchCustomerData:", error);
      setCustomer(null);
    }
  };

  const fetchPoolData = async (customerId: string) => {
    console.log("useCustomerData: fetchPoolData called for customerId:", customerId);
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
        console.error("useCustomerData: Error fetching pool from pool_projects:", projectError);
        // setSelectedPool(null); // Already null by default or from previous reset
        return; // Exit if error
      }

      if (projectData && projectData.pool_spec) {
        console.log("useCustomerData: Pool data from pool_projects:", projectData.pool_spec);
        setSelectedPool(projectData.pool_spec as Pool);
        return;
      }

      // As a fallback, try the pool_selections table
      console.log("useCustomerData: Falling back to pool_selections table for pool data.");
      const { data: selectionData, error: selectionError } = await supabase
        .from('pool_selections')
        .select(`
          id,
          color,
          pool_id,
          pool:pool_id(*)
        `)
        .eq('customer_id', customerId)
        .single(); // Using single, expect one or error

      if (selectionError) {
        if (selectionError.code !== 'PGRST116') { // PGRST116: "JSON object requested, multiple (or no) rows returned" - expected if no selection
          console.error("useCustomerData: Error fetching pool selection:", selectionError);
        } else {
          console.log("useCustomerData: No pool selection found in pool_selections for customerId:", customerId);
        }
        setSelectedPool(null); // Ensure pool is null if not found or error
        return;
      }

      if (selectionData && selectionData.pool) {
        console.log("useCustomerData: Pool data from pool_selections:", selectionData.pool);
        setSelectedPool(selectionData.pool as Pool);
      } else {
        console.log("useCustomerData: No pool data in selectionData.pool from pool_selections.");
        setSelectedPool(null);
      }
    } catch (error) {
      console.error("useCustomerData: Catch block in fetchPoolData:", error);
      setSelectedPool(null);
    }
  };

  useEffect(() => {
    console.log("useCustomerData: useEffect triggered with customerId:", customerId);
    if (customerId) {
      setLoading(true);
      const loadData = async () => {
        try {
          await fetchCustomerData(customerId);
          await fetchPoolData(customerId);
        } catch (e) {
          // Errors are logged within individual fetch functions
          console.error("useCustomerData: Error during loadData orchestration:", e);
        } finally {
          setLoading(false);
          console.log("useCustomerData: setLoading(false) in finally block. Customer:", customer, "SelectedPool:", selectedPool);
        }
      };
      loadData();
    } else {
      console.log("useCustomerData: No customerId provided. Resetting customer, selectedPool, and setLoading to false.");
      setCustomer(null);
      setSelectedPool(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]); // customer and selectedPool should not be dependencies here

  return { customer, selectedPool, loading };
};
