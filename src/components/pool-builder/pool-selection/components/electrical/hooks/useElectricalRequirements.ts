
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ElectricalOption, ElectricalData } from "../types";

export const useElectricalRequirements = (poolId: string, customerId: string | null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<ElectricalOption[]>([]);
  const [electricalData, setElectricalData] = useState<ElectricalData | null>(null);
  const queryClient = useQueryClient();

  // Fetch available electrical options and costs
  const { data: electricalCosts } = useQuery({
    queryKey: ["electrical-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("electrical_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data;
    },
  });

  // Fetch existing electrical selections for this pool/customer
  const { data: existingElectricalData } = useQuery({
    queryKey: ["pool-electrical", poolId, customerId],
    queryFn: async () => {
      if (!poolId || !customerId) return null;

      const { data, error } = await supabase
        .from("pool_electrical_requirements")
        .select("*")
        .eq("pool_id", poolId)
        .eq("customer_id", customerId)
        .maybeSingle();

      if (error) throw error;
      // Return null if no data, ensuring we don't cast an error to ElectricalData
      return data as unknown as (ElectricalData | null);
    },
    enabled: !!poolId && !!customerId,
  });

  // Create a mutation to save electrical requirements
  const saveMutation = useMutation({
    mutationFn: async (data: ElectricalData) => {
      if (!data.id) {
        // Insert new record
        const { data: newData, error } = await supabase
          .from("pool_electrical_requirements")
          .insert(data)
          .select()
          .single();

        if (error) throw error;
        // Use double casting to avoid TypeScript errors
        return newData as unknown as ElectricalData;
      } else {
        // Update existing record
        const { data: updatedData, error } = await supabase
          .from("pool_electrical_requirements")
          .update({
            standard_power: data.standard_power,
            fence_earthing: data.fence_earthing,
            heat_pump_circuit: data.heat_pump_circuit,
            total_cost: data.total_cost,
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.id)
          .select()
          .single();

        if (error) throw error;
        // Use double casting to avoid TypeScript errors
        return updatedData as unknown as ElectricalData;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-electrical", poolId, customerId] });
      toast.success("Electrical requirements saved");
    },
    onError: (error) => {
      toast.error("Failed to save electrical requirements");
      console.error("Save error:", error);
    },
  });

  // Handle toggling options
  const toggleOption = (id: string) => {
    setOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, isSelected: !option.isSelected } : option
      )
    );
  };

  // Save all electrical options
  const saveElectricalRequirements = async () => {
    const standardPowerOption = options.find(opt => opt.description.toLowerCase().includes("standard power"));
    const fenceEarthingOption = options.find(opt => opt.description.toLowerCase().includes("fence earthing"));
    const heatPumpOption = options.find(opt => opt.description.toLowerCase().includes("heat pump"));

    const totalCost = options
      .filter((option) => option.isSelected)
      .reduce((sum, option) => sum + option.rate, 0);

    const data: ElectricalData = {
      id: electricalData?.id,
      pool_id: poolId,
      customer_id: customerId as string,
      standard_power: standardPowerOption?.isSelected || false,
      fence_earthing: fenceEarthingOption?.isSelected || false,
      heat_pump_circuit: heatPumpOption?.isSelected || false,
      total_cost: totalCost,
    };

    saveMutation.mutate(data);
  };

  // Initialize electrical options with data from the database
  useEffect(() => {
    if (electricalCosts && existingElectricalData) {
      const mappedOptions = electricalCosts.map((cost) => {
        // Match option to existing data
        let isSelected = false;
        if (cost.description.toLowerCase().includes("standard power")) {
          isSelected = existingElectricalData.standard_power;
        } else if (cost.description.toLowerCase().includes("fence earthing")) {
          isSelected = existingElectricalData.fence_earthing;
        } else if (cost.description.toLowerCase().includes("heat pump")) {
          isSelected = existingElectricalData.heat_pump_circuit;
        }

        return {
          id: cost.id,
          description: cost.description,
          rate: cost.rate,
          isSelected,
        };
      });

      setOptions(mappedOptions);
      setElectricalData(existingElectricalData);
      setIsLoading(false);
    } else if (electricalCosts) {
      const mappedOptions = electricalCosts.map((cost) => ({
        id: cost.id,
        description: cost.description,
        rate: cost.rate,
        isSelected: false,
      }));

      setOptions(mappedOptions);
      setIsLoading(false);
    }
  }, [electricalCosts, existingElectricalData]);

  const totalCost = options
    .filter((option) => option.isSelected)
    .reduce((sum, option) => sum + option.rate, 0);

  return {
    isLoading,
    options,
    totalCost,
    toggleOption,
    saveElectricalRequirements,
    isSaving: saveMutation.isPending,
  };
};
