import { supabase } from "@/integrations/supabase/client";

/**
 * Simplified function to fetch only the total cost values from concrete and paving tables
 */
export async function fetchConcreteAndPavingData(customerId: string) {
  try {
    // Helper function to convert string to number
    const toNumber = (value: any): number => {
      if (typeof value === 'number') return value;
      if (typeof value === 'string') return parseFloat(value) || 0;
      return 0;
    };

    // Fetch data from each table separately to handle missing records better
    const [concreteResult, pavingResult, fenceStripsResult] = await Promise.all([
      // Fetch from pool_concrete_selections
      supabase
        .from('pool_concrete_selections')
        .select('concrete_pump_total_cost, concrete_cuts_cost, extra_concrete_pump_total_cost')
        .eq('pool_project_id', customerId)
        .maybeSingle(),
      
      // Fetch from pool_paving_selections
      supabase
        .from('pool_paving_selections')
        .select('extra_paving_total_cost, existing_concrete_paving_total_cost, extra_concreting_total_cost')
        .eq('pool_project_id', customerId)
        .maybeSingle(),
      
      // Fetch from pool_fence_concrete_strips
      supabase
        .from('pool_fence_concrete_strips')
        .select('total_cost')
        .eq('pool_project_id', customerId)
        .maybeSingle()
    ]);

    // Log results for debugging
    console.log("Concrete selections result:", concreteResult);
    console.log("Paving selections result:", pavingResult);
    console.log("Fence strips result:", fenceStripsResult);

    // Handle errors (ignore PGRST116 which means no rows found)
    if (concreteResult.error && concreteResult.error.code !== 'PGRST116') {
      console.error("Error fetching concrete selections:", concreteResult.error);
    }
    if (pavingResult.error && pavingResult.error.code !== 'PGRST116') {
      console.error("Error fetching paving selections:", pavingResult.error);
    }
    if (fenceStripsResult.error && fenceStripsResult.error.code !== 'PGRST116') {
      console.error("Error fetching fence concrete strips:", fenceStripsResult.error);
    }

    // Extract data with defaults
    const concreteSelections = concreteResult.data || {};
    const pavingSelections = pavingResult.data || {};
    const fenceConcreteStrips = fenceStripsResult.data || {};

    // Return only the cost values
    return {
      // From pool_concrete_selections
      concrete_pump_total_cost: toNumber(concreteSelections.concrete_pump_total_cost),
      concrete_cuts_cost: toNumber(concreteSelections.concrete_cuts_cost),
      extra_concrete_pump_total_cost: toNumber(concreteSelections.extra_concrete_pump_total_cost),
      
      // From pool_paving_selections
      extra_paving_total_cost: toNumber(pavingSelections.extra_paving_total_cost),
      existing_concrete_paving_total_cost: toNumber(pavingSelections.existing_concrete_paving_total_cost),
      extra_concreting_total_cost: toNumber(pavingSelections.extra_concreting_total_cost),
      
      // From pool_fence_concrete_strips
      under_fence_concrete_strips_cost: toNumber(fenceConcreteStrips.total_cost)
    };
  } catch (error) {
    console.error("Error in fetchConcreteAndPavingData:", error);
    return null;
  }
}
