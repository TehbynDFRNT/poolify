
import { useState, useEffect } from 'react';
import { ExtraPavingCost } from '@/types/extra-paving-cost';
import { ConcreteCost } from '@/types/concrete-cost';
import { ConcreteLabourCost } from '@/types/concrete-labour-cost';

interface CostCalculation {
  perMeterCost: number;
  totalCost: number;
  materialCost: number;
  labourCost: number;
}

export const useConcreteCostCalculator = (
  selectedPavingId: string,
  meters: number,
  extraPavingCosts: ExtraPavingCost[] | undefined,
  concreteCosts: ConcreteCost[] | undefined,
  concreteLabourCosts: ConcreteLabourCost[] | undefined
): CostCalculation => {
  const [costs, setCosts] = useState<CostCalculation>({
    perMeterCost: 0,
    totalCost: 0,
    materialCost: 0,
    labourCost: 0
  });

  useEffect(() => {
    if (!selectedPavingId || !extraPavingCosts || !concreteCosts || !concreteLabourCosts || meters <= 0) {
      setCosts({
        perMeterCost: 0,
        totalCost: 0,
        materialCost: 0,
        labourCost: 0
      });
      return;
    }

    // Find selected paving
    const selectedPaving = extraPavingCosts.find(p => p.id === selectedPavingId);
    if (!selectedPaving) return;

    // Get default concrete and labour costs (first one for now, could be made selectable)
    const defaultConcreteCost = concreteCosts[0] || { concrete_cost: 0, dust_cost: 0, total_cost: 0 };
    const defaultLabourCost = concreteLabourCosts[0] || { cost: 0 };

    // Calculate costs
    const pavingCost = selectedPaving.paver_cost + selectedPaving.wastage_cost + selectedPaving.margin_cost;
    const concreteCost = defaultConcreteCost.total_cost;
    const laborCost = defaultLabourCost.cost;
    
    const calculatedPerMeterCost = pavingCost + concreteCost + laborCost;
    const materialTotal = (pavingCost + concreteCost) * meters;
    const labourTotal = laborCost * meters;
    
    setCosts({
      perMeterCost: calculatedPerMeterCost,
      totalCost: calculatedPerMeterCost * meters,
      materialCost: materialTotal,
      labourCost: labourTotal
    });
  }, [selectedPavingId, meters, extraPavingCosts, concreteCosts, concreteLabourCosts]);

  return costs;
};
