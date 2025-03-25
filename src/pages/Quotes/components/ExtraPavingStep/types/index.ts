
export interface PavingSelection {
  quoteId: string;
  pavingId: string;
  pavingCategory: string;
  paverCost: number;
  wastageCost: number;
  marginCost: number;
  meters: number;
  totalCost: number;
}

export interface ConcreteCutSelection {
  id: string;
  cut_type: string;
  price: number;
  quantity: number;
}

export interface ExtraPavingData {
  pavingSelections: PavingSelection[];
  concretePumpRequired: boolean;
  concreteCuts: ConcreteCutSelection[];
  totalCost: number;
}
