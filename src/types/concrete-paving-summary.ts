
export interface SummaryData {
  extraPavingCost: number;
  existingConcretePavingCost: number;
  extraConcretingCost: number;
  concretePumpCost: number;
  underFenceStripsCost: number;
  concreteCutsCost: number;
  extraPavingMargin: number;
  existingConcretePavingMargin: number;
  extraConcretingMargin: number;
  concretePumpMargin: number;
  underFenceStripsMargin: number;
  concreteCutsMargin: number;
  totalCost: number;
  totalMargin: number;
  marginPercentage: number;
}

export interface ConcreteStripData {
  id: string;
  length?: number;
  quantity?: number;
}
