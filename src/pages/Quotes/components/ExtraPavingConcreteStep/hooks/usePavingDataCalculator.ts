
import { useState, useEffect } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";

interface PavingDetails {
  paverCost: number;
  wastageCost: number;
  marginCost: number;
}

interface ConcreteDetails {
  costPerMeter: number;
}

interface LabourDetails {
  baseCost: number;
  marginCost: number;
}

interface CostData {
  perMeterCost: number;
  materialCost: number;
  labourCost: number;
  marginCost: number;
  totalCost: number;
  pavingDetails: PavingDetails | null;
  concreteDetails: ConcreteDetails | null;
  labourDetails: LabourDetails | null;
  hasCostData: boolean;
}

export const usePavingDataCalculator = (selectedPavingId: string, meters: number) => {
  const { extraPavingCosts, isLoading: isPavingLoading } = useExtraPavingCosts();
  const { concreteLabourCosts, isLoading: isLabourLoading } = useConcreteLabourCosts();
  const { concreteCosts, isLoading: isConcreteLoading } = useConcreteCosts();
  
  const [costData, setCostData] = useState<CostData>({
    perMeterCost: 0,
    materialCost: 0,
    labourCost: 0,
    marginCost: 0,
    totalCost: 0,
    pavingDetails: null,
    concreteDetails: null,
    labourDetails: null,
    hasCostData: false
  });

  // Reset cost data
  const resetCostData = () => {
    setCostData({
      perMeterCost: 0,
      materialCost: 0,
      labourCost: 0,
      marginCost: 0,
      totalCost: 0,
      pavingDetails: null,
      concreteDetails: null,
      labourDetails: null,
      hasCostData: false
    });
  };

  // Calculate costs
  const calculateCosts = (pavingId: string, area: number) => {
    if (!pavingId || area <= 0 || !extraPavingCosts || !concreteLabourCosts || !concreteCosts) {
      resetCostData();
      return;
    }
    
    const selectedPaving = extraPavingCosts.find(p => p.id === pavingId);
    if (!selectedPaving) {
      resetCostData();
      return;
    }
    
    // Calculate paving costs
    const paverCost = selectedPaving.paver_cost;
    const wastageCost = selectedPaving.wastage_cost;
    const marginCostPerMeter = selectedPaving.margin_cost;
    
    // Calculate labour costs
    let totalLabourCost = 0;
    let totalLabourMargin = 0;
    
    concreteLabourCosts.forEach(labour => {
      totalLabourCost += labour.cost;
      totalLabourMargin += labour.margin;
    });
    
    // Calculate concrete costs
    let concreteCostPerMeter = 0;
    
    if (concreteCosts.length > 0 && 'price' in concreteCosts[0]) {
      concreteCostPerMeter = concreteCosts[0].price;
    }
    
    // Calculate totals
    const totalMaterialCost = (paverCost + wastageCost + concreteCostPerMeter) * area;
    const totalLabour = totalLabourCost * area;
    const totalMargin = (marginCostPerMeter + totalLabourMargin) * area;
    const perMeterTotal = paverCost + wastageCost + concreteCostPerMeter + totalLabourCost + marginCostPerMeter + totalLabourMargin;
    const calculatedTotalCost = totalMaterialCost + totalLabour + totalMargin;
    
    // Update state with calculated costs
    setCostData({
      perMeterCost: perMeterTotal,
      materialCost: totalMaterialCost,
      labourCost: totalLabour,
      marginCost: totalMargin,
      totalCost: calculatedTotalCost,
      hasCostData: true,
      // Set details for display
      pavingDetails: {
        paverCost,
        wastageCost,
        marginCost: marginCostPerMeter
      },
      concreteDetails: {
        costPerMeter: concreteCostPerMeter
      },
      labourDetails: {
        baseCost: totalLabourCost,
        marginCost: totalLabourMargin
      }
    });
  };

  // Calculate costs when inputs change
  useEffect(() => {
    if (selectedPavingId && meters > 0) {
      calculateCosts(selectedPavingId, meters);
    } else {
      resetCostData();
    }
  }, [selectedPavingId, meters, extraPavingCosts, concreteLabourCosts, concreteCosts]);

  const isLoading = isPavingLoading || isLabourLoading || isConcreteLoading;

  return {
    ...costData,
    isLoading,
    resetCostData
  };
};
