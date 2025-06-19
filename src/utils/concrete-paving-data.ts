import { supabase } from "@/integrations/supabase/client";
import { PoolConcreteSelection, PoolFenceConcreteStrip, PoolPavingSelection } from "@/integrations/supabase/types";

/**
 * Fetch the concrete and paving data for a specific customer
 */
export async function fetchConcreteAndPavingData(customerId: string) {
  try {
    const { data: projectData, error: projectError } = await supabase
      .from('pool_projects')
      .select(`
        id,
        pool_concrete_selections(
          concrete_pump_needed,
          concrete_pump_quantity,
          concrete_pump_total_cost,
          concrete_cuts,
          concrete_cuts_cost,
          extra_concrete_pump,
          extra_concrete_pump_quantity,
          extra_concrete_pump_total_cost
        ),
        pool_paving_selections(
          extra_paving_category,
          extra_paving_square_meters,
          extra_paving_total_cost,
          existing_concrete_paving_category,
          existing_concrete_paving_square_meters,
          existing_concrete_paving_total_cost,
          extra_concreting_type,
          extra_concreting_square_meters,
          extra_concreting_total_cost
        ),
        pool_fence_concrete_strips(
          strip_data,
          total_cost
        )
      `)
      .eq('id', customerId)
      .single();

    if (projectError) {
      console.error("Error fetching concrete and paving data:", projectError);
      return null;
    }

    if (!projectData) return null;

    // Extract the concrete and paving data from the nested objects
    const concreteSelections = (projectData.pool_concrete_selections?.[0] || {}) as PoolConcreteSelection;
    const pavingSelections = (projectData.pool_paving_selections?.[0] || {}) as PoolPavingSelection;
    const fenceConcreteStrips = (projectData.pool_fence_concrete_strips?.[0] || {}) as PoolFenceConcreteStrip;

    // Return a flattened object with all the data
    return {
      // Concrete pump data
      concrete_pump_needed: concreteSelections.concrete_pump_needed,
      concrete_pump_quantity: concreteSelections.concrete_pump_quantity,
      concrete_pump_total_cost: concreteSelections.concrete_pump_total_cost,
      concrete_cuts: concreteSelections.concrete_cuts,
      concrete_cuts_cost: concreteSelections.concrete_cuts_cost,
      
      // Extra concrete pump data
      extra_concrete_pump: concreteSelections.extra_concrete_pump,
      extra_concrete_pump_quantity: concreteSelections.extra_concrete_pump_quantity,
      extra_concrete_pump_total_cost: concreteSelections.extra_concrete_pump_total_cost,

      // Paving data
      extra_paving_category: pavingSelections.extra_paving_category,
      extra_paving_square_meters: pavingSelections.extra_paving_square_meters,
      extra_paving_total_cost: pavingSelections.extra_paving_total_cost,
      existing_concrete_paving_category: pavingSelections.existing_concrete_paving_category,
      existing_concrete_paving_square_meters: pavingSelections.existing_concrete_paving_square_meters,
      existing_concrete_paving_total_cost: pavingSelections.existing_concrete_paving_total_cost,

      // Extra concreting data
      extra_concreting_type: pavingSelections.extra_concreting_type,
      extra_concreting_square_meters: pavingSelections.extra_concreting_square_meters,
      extra_concreting_total_cost: pavingSelections.extra_concreting_total_cost,

      // Fence concrete strips data
      under_fence_concrete_strips_data: fenceConcreteStrips.strip_data,
      under_fence_concrete_strips_cost: fenceConcreteStrips.total_cost
    };
  } catch (error) {
    console.error("Error in fetchConcreteAndPavingData:", error);
    return null;
  }
}
