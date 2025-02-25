
export interface ElectricalCost {
  id: string;
  description: string;
  rate: number;
  display_order: number;
}

export type ElectricalCostInsert = {
  description: string;
  rate: number;
  display_order?: number;
}
