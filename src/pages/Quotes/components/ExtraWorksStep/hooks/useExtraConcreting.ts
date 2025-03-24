
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

export interface ConcretingSelection {
  typeId: string;
  quantity: number;
  cost: number;
}

export const useExtraConcreting = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [concretingSelections, setConcretingSelections] = useState<ConcretingSelection[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  // Load concrete labour types from the database
  const { data: concretingTypes, isLoading } = useQuery({
    queryKey: ["concrete-labour-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concrete_labour_costs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching concrete labour costs:", error);
        throw error;
      }

      return data;
    },
  });

  // Add a new concreting selection
  const addConcretingSelection = () => {
    if (concretingTypes && concretingTypes.length > 0) {
      const newSelection: ConcretingSelection = {
        typeId: concretingTypes[0].id,
        quantity: 1,
        cost: concretingTypes[0].cost * (1 + concretingTypes[0].margin/100)
      };
      setConcretingSelections([...concretingSelections, newSelection]);
    }
  };

  // Update a concreting selection
  const updateConcretingSelection = (index: number, updates: Partial<ConcretingSelection>) => {
    const updatedSelections = [...concretingSelections];
    updatedSelections[index] = { ...updatedSelections[index], ...updates };
    
    // Recalculate cost if quantity or type changed
    if (updates.quantity !== undefined || updates.typeId !== undefined) {
      const type = concretingTypes?.find(t => t.id === updatedSelections[index].typeId);
      if (type) {
        updatedSelections[index].cost = type.cost * (1 + type.margin/100) * updatedSelections[index].quantity;
      }
    }
    
    setConcretingSelections(updatedSelections);
  };

  // Remove a concreting selection
  const removeConcretingSelection = (index: number) => {
    const updatedSelections = [...concretingSelections];
    updatedSelections.splice(index, 1);
    setConcretingSelections(updatedSelections);
  };

  // Calculate total cost whenever selections change
  useEffect(() => {
    const newTotalCost = concretingSelections.reduce((acc, selection) => acc + selection.cost, 0);
    setTotalCost(newTotalCost);
  }, [concretingSelections]);

  return {
    concretingTypes,
    concretingSelections,
    setConcretingSelections,
    isLoading,
    totalCost,
    addConcretingSelection,
    updateConcretingSelection,
    removeConcretingSelection
  };
};
