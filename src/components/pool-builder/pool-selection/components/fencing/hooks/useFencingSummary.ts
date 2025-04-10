
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

export interface FencingSummary {
  fencingType: string; // "Frameless Glass" or "Flat Top Metal"
  linearMeters: number;
  gatesCount: number;
  simplePanels: number;
  complexPanels: number;
  hasEarthing: boolean;
  linearCost: number;
  gatesCost: number;
  simplePanelsCost: number;
  complexPanelsCost: number;
  earthingCost: number;
  totalCost: number;
  freeGateDiscount?: number;
}

export interface FencingSummaryData {
  fencings: FencingSummary[];
  totalCost: number;
}

export const useFencingSummary = (customerId: string | null, updateCounter: number = 0) => {
  const [summaryData, setSummaryData] = useState<FencingSummaryData>({
    fencings: [],
    totalCost: 0
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["fencing-summary", customerId, updateCounter],
    queryFn: async () => {
      if (!customerId) return null;

      // Fetch frameless glass fencing data
      const { data: framelessData, error: framelessError } = await supabase
        .from("frameless_glass_fencing")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (framelessError) {
        console.error("Error fetching frameless fencing:", framelessError);
        throw framelessError;
      }

      // Fetch flat top metal fencing data
      const { data: flatTopData, error: flatTopError } = await supabase
        .from("flat_top_metal_fencing")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(1) as any; // Type assertion until Supabase types are updated

      if (flatTopError) {
        console.error("Error fetching flat top fencing:", flatTopError);
        throw flatTopError;
      }

      const fencingSummaries: FencingSummary[] = [];
      let totalCost = 0;

      // Process frameless glass data if it exists
      if (framelessData && framelessData.length > 0) {
        const framelessFencing = framelessData[0];
        const linearCost = framelessFencing.linear_meters * 195;
        const gatesCost = framelessFencing.gates * 385;
        const simplePanelsCost = framelessFencing.simple_panels * 220;
        const complexPanelsCost = framelessFencing.complex_panels * 385;
        const earthingCost = framelessFencing.earthing_required ? 40 : 0;
        // Calculate free gate discount (first gate is free)
        const freeGateDiscount = framelessFencing.gates > 0 ? -385 : 0;
        
        const framelessTotal = linearCost + gatesCost + simplePanelsCost + complexPanelsCost + earthingCost + freeGateDiscount;
        
        fencingSummaries.push({
          fencingType: "Frameless Glass",
          linearMeters: framelessFencing.linear_meters,
          gatesCount: framelessFencing.gates,
          simplePanels: framelessFencing.simple_panels,
          complexPanels: framelessFencing.complex_panels,
          hasEarthing: framelessFencing.earthing_required,
          linearCost,
          gatesCost,
          simplePanelsCost,
          complexPanelsCost,
          earthingCost,
          freeGateDiscount,
          totalCost: framelessTotal
        });
        
        totalCost += framelessTotal;
      }

      // Process flat top metal data if it exists
      if (flatTopData && flatTopData.length > 0) {
        const flatTopFencing = flatTopData[0];
        const linearCost = flatTopFencing.linear_meters * 165;
        const gatesCost = flatTopFencing.gates * 297;
        const simplePanelsCost = flatTopFencing.simple_panels * 220;
        const complexPanelsCost = flatTopFencing.complex_panels * 385;
        const earthingCost = flatTopFencing.earthing_required ? 150 : 0;
        
        const flatTopTotal = linearCost + gatesCost + simplePanelsCost + complexPanelsCost + earthingCost;
        
        fencingSummaries.push({
          fencingType: "Flat Top Metal",
          linearMeters: flatTopFencing.linear_meters,
          gatesCount: flatTopFencing.gates,
          simplePanels: flatTopFencing.simple_panels,
          complexPanels: flatTopFencing.complex_panels,
          hasEarthing: flatTopFencing.earthing_required,
          linearCost,
          gatesCost,
          simplePanelsCost,
          complexPanelsCost,
          earthingCost,
          totalCost: flatTopTotal
        });
        
        totalCost += flatTopTotal;
      }

      return {
        fencings: fencingSummaries,
        totalCost
      };
    },
    enabled: !!customerId
  });

  useEffect(() => {
    if (data) {
      setSummaryData(data);
    }
  }, [data]);

  return {
    data: summaryData,
    isLoading,
    error
  };
};
