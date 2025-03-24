
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CraneCost } from "@/types/crane-cost";
import { TrafficControlCost } from "@/types/traffic-control-cost";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

export const useSiteRequirementsCost = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [siteRequirementsCost, setSiteRequirementsCost] = useState<number>(0);

  // Fetch crane costs
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
      
      return data as CraneCost[];
    }
  });

  // Fetch traffic control costs
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
      
      return data as TrafficControlCost[];
    }
  });

  // Find default Franna crane for comparison
  const defaultCrane = craneCosts?.find(crane => 
    crane.name === "Franna Crane-S20T-L1"
  );

  // Calculate additional cost if a non-default crane is selected
  useEffect(() => {
    let totalCost = 0;
    
    // Calculate crane cost difference if not using default
    if (quoteData.crane_id && defaultCrane && craneCosts) {
      const selectedCrane = craneCosts.find(crane => crane.id === quoteData.crane_id);
      if (selectedCrane && selectedCrane.id !== defaultCrane.id) {
        // Only add the difference in cost between selected crane and default
        totalCost += selectedCrane.price - defaultCrane.price;
      }
    }
    
    // Add traffic control cost if selected
    if (quoteData.traffic_control_id && quoteData.traffic_control_id !== "none" && trafficControlCosts) {
      const selectedTrafficControl = trafficControlCosts.find(
        tc => tc.id === quoteData.traffic_control_id
      );
      if (selectedTrafficControl) {
        totalCost += selectedTrafficControl.price;
      }
    }
    
    setSiteRequirementsCost(totalCost);
    
    // Update quote data with the site requirements cost
    updateQuoteData({ 
      site_requirements_cost: totalCost 
    });
  }, [quoteData.crane_id, quoteData.traffic_control_id, craneCosts, trafficControlCosts, defaultCrane, updateQuoteData]);

  return {
    siteRequirementsCost,
    handleCraneChange: (craneId: string) => {
      updateQuoteData({ crane_id: craneId });
    },
    handleTrafficControlChange: (trafficControlId: string) => {
      updateQuoteData({ traffic_control_id: trafficControlId });
    }
  };
};
