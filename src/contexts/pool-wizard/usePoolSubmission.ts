
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PoolFormValues } from "@/types/pool";
import { UseFormReturn } from "react-hook-form";

interface PoolSubmissionProps {
  form: UseFormReturn<PoolFormValues>;
  selectedCraneId: string | null;
  selectedDigTypeId: string | null;
  marginPercentage: number;
}

export const usePoolSubmission = ({
  form,
  selectedCraneId,
  selectedDigTypeId,
  marginPercentage
}: PoolSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Submit all data 
  const submitPool = async () => {
    try {
      setIsSubmitting(true);
      
      // Get form values
      const values = form.getValues();
      
      // Ensure required values have valid defaults if not set
      const poolData = {
        ...values,
        width: values.width || 0,
        length: values.length || 0,
        depth_shallow: values.depth_shallow || 0,
        depth_deep: values.depth_deep || 0,
      };
      
      // 1. Create the pool record
      const { data: insertedPool, error: poolError } = await supabase
        .from("pool_specifications")
        .insert(poolData)
        .select()
        .single();
        
      if (poolError) throw poolError;
      
      const poolId = insertedPool.id;
      
      // 2. Create pool costs record
      const poolCostsData = {
        pool_id: poolId,
        pea_gravel: 0,
        install_fee: 0,
        trucked_water: 0,
        salt_bags: 0,
        misc: 2700,
        coping_supply: 0,
        beam: 0,
        coping_lay: 0
      };
      
      const { error: costsError } = await supabase
        .from("pool_costs")
        .insert([poolCostsData]);
        
      if (costsError) throw costsError;
      
      // 3. If a dig type was selected, create the match
      if (selectedDigTypeId) {
        const { error: digTypeError } = await supabase
          .from("pool_dig_type_matches")
          .insert([{
            pool_id: poolId,
            dig_type_id: selectedDigTypeId
          }]);
          
        if (digTypeError) throw digTypeError;
      }
      
      // 4. If a crane was selected, create the selection
      if (selectedCraneId) {
        const { error: craneError } = await supabase
          .from("pool_crane_selections")
          .insert([{
            pool_id: poolId,
            crane_id: selectedCraneId
          }]);
          
        if (craneError) throw craneError;
      }
      
      // 5. Create margin record
      const { error: marginError } = await supabase
        .from("pool_margins")
        .insert([{
          pool_id: poolId,
          margin_percentage: marginPercentage
        }]);
        
      if (marginError) throw marginError;
      
      toast.success("Pool created successfully!");
      navigate(`/price-builder/pool/${poolId}`);
      
    } catch (error) {
      console.error("Error submitting pool:", error);
      toast.error("Failed to create pool. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitPool
  };
};
