
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { ConcreteLabourCost } from "@/types/concrete-labour-cost";

export interface PavingSelection {
  categoryId: string;
  meters: number;
  cost: number;
  materialMargin?: number;
  labourMargin?: number;
  totalMargin?: number;
}

export const useExtraPaving = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [pavingSelections, setPavingSelections] = useState<PavingSelection[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalMargin, setTotalMargin] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load extra paving categories from the database
  const { data: pavingCategories, isLoading: isLoadingPaving } = useQuery({
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

  // Load concrete labour costs from the database
  const { data: concreteLabourCosts, isLoading: isLoadingLabour } = useQuery({
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

      return data as ConcreteLabourCost[];
    },
  });

  // Initialize from saved data if it exists
  useEffect(() => {
    if (quoteData.custom_requirements_json) {
      try {
        const extraWorksData = JSON.parse(quoteData.custom_requirements_json);
        if (extraWorksData.pavingSelections && extraWorksData.pavingSelections.length > 0) {
          console.log("Initializing from saved paving selections:", extraWorksData.pavingSelections);
          setPavingSelections(extraWorksData.pavingSelections);
        }
      } catch (error) {
        console.error("Error parsing saved paving selections:", error);
      }
    }
  }, [quoteData.custom_requirements_json]);

  // Add a new paving selection
  const addPavingSelection = () => {
    if (pavingCategories && pavingCategories.length > 0) {
      const newSelection: PavingSelection = {
        categoryId: pavingCategories[0].id,
        meters: 0,
        cost: 0,
        materialMargin: 0,
        labourMargin: 0,
        totalMargin: 0
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
      
      if (category && concreteLabourCosts && concreteLabourCosts.length > 0) {
        // Get the standard paving costs
        const pavingPerMeter = category.paver_cost + category.wastage_cost + category.margin_cost;
        
        // Get the labor cost - using the first labour cost in the list
        const laborCost = concreteLabourCosts[0].cost;
        const laborMargin = concreteLabourCosts[0].margin;
        
        // Calculate total per meter including labor cost and margin
        const totalPerMeter = pavingPerMeter + laborCost + laborMargin;
        
        // Calculate final cost based on meters
        const meters = updatedSelections[index].meters;
        
        // Calculate final cost
        updatedSelections[index].cost = totalPerMeter * meters;
        
        // Calculate margins
        updatedSelections[index].materialMargin = category.margin_cost * meters;
        updatedSelections[index].labourMargin = laborMargin * meters;
        updatedSelections[index].totalMargin = 
          (updatedSelections[index].materialMargin || 0) + 
          (updatedSelections[index].labourMargin || 0);
          
        console.log(
          `Updated paving selection ${index}:`, 
          `meters=${meters}`, 
          `totalPerMeter=${totalPerMeter}`, 
          `totalCost=${updatedSelections[index].cost}`
        );
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

  // Calculate total cost and margin whenever selections change
  useEffect(() => {
    const newTotalCost = pavingSelections.reduce((acc, selection) => acc + selection.cost, 0);
    const newTotalMargin = pavingSelections.reduce((acc, selection) => acc + (selection.totalMargin || 0), 0);
    
    console.log("Paving selections changed, new total cost:", newTotalCost);
    console.log("Selections:", pavingSelections);
    
    setTotalCost(newTotalCost);
    setTotalMargin(newTotalMargin);
    
    // Update the parent container with the cost for aggregation
    if (containerRef.current) {
      containerRef.current.setAttribute('data-cost', newTotalCost.toString());
      containerRef.current.setAttribute('data-margin', newTotalMargin.toString());
    }
  }, [pavingSelections]);

  const isLoading = isLoadingPaving || isLoadingLabour;

  return {
    pavingCategories,
    concreteLabourCosts,
    pavingSelections,
    setPavingSelections,
    isLoading,
    totalCost,
    totalMargin,
    addPavingSelection,
    updatePavingSelection,
    removePavingSelection,
    containerRef
  };
};
