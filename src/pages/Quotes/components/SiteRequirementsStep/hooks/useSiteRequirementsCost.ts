
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

export const useSiteRequirementsCost = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [siteRequirementsCost, setSiteRequirementsCost] = useState(0);
  
  // Fetch crane costs and traffic control costs
  const { data: craneCosts } = useQuery({
    queryKey: ["crane-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crane_costs")
        .select("*")
        .order("display_order");
      
      if (error) {
        console.error("Error fetching crane costs:", error);
        return [];
      }
      
      return data;
    }
  });
  
  const { data: trafficControlCosts } = useQuery({
    queryKey: ["traffic-control-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("traffic_control_costs")
        .select("*")
        .order("display_order");
      
      if (error) {
        console.error("Error fetching traffic control costs:", error);
        return [];
      }
      
      return data;
    }
  });
  
  // Calculate total site requirements cost
  useEffect(() => {
    let totalCost = 0;
    
    // Find default Franna crane for comparison if selected crane is different
    const defaultCrane = craneCosts?.find(crane => 
      crane.name === "Franna Crane-S20T-L1"
    );
    
    // Add crane cost (if not the default crane)
    if (craneCosts && quoteData.crane_id && defaultCrane) {
      const selectedCrane = craneCosts.find(crane => crane.id === quoteData.crane_id);
      if (selectedCrane && selectedCrane.id !== defaultCrane.id) {
        // Only add the difference in price between selected crane and default
        totalCost += selectedCrane.price - defaultCrane.price;
      }
    }
    
    // Add traffic control cost if selected
    if (trafficControlCosts && quoteData.traffic_control_id && quoteData.traffic_control_id !== 'none') {
      const selectedTrafficControl = trafficControlCosts.find(
        tc => tc.id === quoteData.traffic_control_id
      );
      if (selectedTrafficControl) {
        totalCost += selectedTrafficControl.price;
      }
    }
    
    setSiteRequirementsCost(totalCost);
  }, [craneCosts, trafficControlCosts, quoteData.crane_id, quoteData.traffic_control_id]);
  
  // Handlers
  const handleCraneChange = (craneId: string) => {
    updateQuoteData({ crane_id: craneId });
  };
  
  const handleTrafficControlChange = (trafficControlId: string) => {
    updateQuoteData({ traffic_control_id: trafficControlId });
  };
  
  return {
    siteRequirementsCost,
    handleCraneChange,
    handleTrafficControlChange
  };
};
