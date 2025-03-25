
import { useState, useEffect, useRef, useCallback } from "react";
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
  const { quoteData } = useQuoteContext();
  const [pavingSelections, setPavingSelections] = useState<PavingSelection[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalMargin, setTotalMargin] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialLoadDone = useRef(false);

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

  // Load saved paving selections
  const loadSavedSelections = useCallback((customRequirementsJson?: string) => {
    if (!customRequirementsJson) {
      console.log("No custom requirements JSON to load");
      return;
    }
    
    try {
      const extraWorksData = JSON.parse(customRequirementsJson);
      
      // Check if pavingSelections exists, is an array, and has items
      if (extraWorksData && 
          extraWorksData.pavingSelections && 
          Array.isArray(extraWorksData.pavingSelections) && 
          extraWorksData.pavingSelections.length > 0) {
        
        console.log("Loading saved paving selections:", extraWorksData.pavingSelections);
        
        // Make sure all required fields exist in each saved selection
        const validSelections = extraWorksData.pavingSelections.filter((selection: any) => {
          return selection && 
                 typeof selection.categoryId === 'string' && 
                 typeof selection.meters === 'number' && 
                 typeof selection.cost === 'number';
        });
        
        setPavingSelections(validSelections);
        initialLoadDone.current = true;
      } else {
        console.log("No valid paving selections found in saved data");
        setPavingSelections([]);
      }
    } catch (error) {
      console.error("Error parsing saved paving selections:", error);
      setPavingSelections([]);
    }
  }, []);

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
      setPavingSelections(prev => [...prev, newSelection]);
    }
  };

  // Update a paving selection and recalculate costs
  const updatePavingSelection = (index: number, updates: Partial<PavingSelection>) => {
    const updatedSelections = [...pavingSelections];
    
    // Ensure index is valid
    if (index < 0 || index >= updatedSelections.length) {
      console.error(`Invalid selection index: ${index}`);
      return;
    }
    
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
        
        // Calculate final cost with proper number formatting
        updatedSelections[index].cost = parseFloat((totalPerMeter * meters).toFixed(2));
        
        // Calculate margins with proper number formatting
        updatedSelections[index].materialMargin = parseFloat((category.margin_cost * meters).toFixed(2));
        updatedSelections[index].labourMargin = parseFloat((laborMargin * meters).toFixed(2));
        updatedSelections[index].totalMargin = parseFloat((
          (updatedSelections[index].materialMargin || 0) + 
          (updatedSelections[index].labourMargin || 0)
        ).toFixed(2));
          
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
    setPavingSelections(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate total cost and margin whenever selections change
  useEffect(() => {
    // Skip calculation if no selections exist
    if (pavingSelections.length === 0) {
      setTotalCost(0);
      setTotalMargin(0);
      return;
    }
    
    const newTotalCost = pavingSelections.reduce((acc, selection) => acc + (selection.cost || 0), 0);
    const newTotalMargin = pavingSelections.reduce((acc, selection) => acc + (selection.totalMargin || 0), 0);
    
    // Format to 2 decimal places
    const formattedTotalCost = parseFloat(newTotalCost.toFixed(2));
    const formattedTotalMargin = parseFloat(newTotalMargin.toFixed(2));
    
    console.log("Paving selections changed, new total cost:", formattedTotalCost);
    console.log("Selections:", pavingSelections);
    
    setTotalCost(formattedTotalCost);
    setTotalMargin(formattedTotalMargin);
    
    // Update the parent container with the cost for aggregation
    if (containerRef.current) {
      containerRef.current.setAttribute('data-cost', formattedTotalCost.toString());
      containerRef.current.setAttribute('data-margin', formattedTotalMargin.toString());
    }
  }, [pavingSelections]);

  // Load saved data when component mounts or customRequirements changes
  useEffect(() => {
    if (quoteData.custom_requirements_json && !initialLoadDone.current) {
      loadSavedSelections(quoteData.custom_requirements_json);
    }
  }, [quoteData.custom_requirements_json, loadSavedSelections]);

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
    containerRef,
    loadSavedSelections
  };
};
