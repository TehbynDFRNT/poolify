
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { ExtraPavingCost } from "@/types/extra-paving-cost";

export interface PavingSelection {
  categoryId: string;
  meters: number;
  cost: number;
}

export const useExtraPaving = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [pavingSelections, setPavingSelections] = useState<PavingSelection[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load extra paving categories from the database
  const { data: pavingCategories, isLoading } = useQuery({
    queryKey: ["extra-paving-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("extra_paving_costs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching extra paving costs:", error);
        throw error;
      }

      return data as ExtraPavingCost[];
    },
  });

  // Add a new paving selection
  const addPavingSelection = () => {
    if (pavingCategories && pavingCategories.length > 0) {
      const newSelection: PavingSelection = {
        categoryId: pavingCategories[0].id,
        meters: 0,
        cost: 0
      };
      setPavingSelections([...pavingSelections, newSelection]);
    }
  };

  // Update a paving selection
  const updatePavingSelection = (index: number, updates: Partial<PavingSelection>) => {
    const updatedSelections = [...pavingSelections];
    updatedSelections[index] = { ...updatedSelections[index], ...updates };
    
    // Recalculate cost if meters or category changed
    if (updates.meters !== undefined || updates.categoryId !== undefined) {
      const category = pavingCategories?.find(cat => cat.id === updatedSelections[index].categoryId);
      if (category) {
        const totalPerMeter = category.paver_cost + category.wastage_cost + category.margin_cost;
        updatedSelections[index].cost = totalPerMeter * updatedSelections[index].meters;
      }
    }
    
    setPavingSelections(updatedSelections);
  };

  // Remove a paving selection
  const removePavingSelection = (index: number) => {
    const updatedSelections = [...pavingSelections];
    updatedSelections.splice(index, 1);
    setPavingSelections(updatedSelections);
  };

  // Calculate total cost whenever selections change
  useEffect(() => {
    const newTotalCost = pavingSelections.reduce((acc, selection) => acc + selection.cost, 0);
    setTotalCost(newTotalCost);
    
    // Update the parent container with the cost for aggregation
    if (containerRef.current) {
      containerRef.current.setAttribute('data-cost', newTotalCost.toString());
    }
  }, [pavingSelections]);

  return {
    pavingCategories,
    pavingSelections,
    isLoading,
    totalCost,
    addPavingSelection,
    updatePavingSelection,
    removePavingSelection,
    containerRef
  };
};
