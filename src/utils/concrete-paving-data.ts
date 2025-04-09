
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch the concrete and paving data for a specific customer
 */
export async function fetchConcreteAndPavingData(customerId: string) {
  try {
    const { data, error } = await supabase
      .from('pool_projects')
      .select(`
        extra_paving_total_cost,
        existing_concrete_paving_total_cost,
        extra_concreting_total_cost,
        concrete_pump_total_cost,
        under_fence_concrete_strips_cost,
        concrete_cuts_cost,
        extra_paving_category,
        extra_paving_square_meters,
        existing_concrete_paving_category,
        existing_concrete_paving_square_meters,
        extra_concreting_type,
        extra_concreting_square_meters,
        under_fence_concrete_strips_data
      `)
      .eq('id', customerId)
      .single();
      
    if (error) {
      console.error("Error fetching concrete and paving data:", error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchConcreteAndPavingData:", error);
    return null;
  }
}
