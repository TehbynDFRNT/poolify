
export interface FencingCost {
  id: string;
  description: string;
  rate: number;
  display_order: number;
}

export type FencingCostInsert = {
  description: string;
  rate: number;
  display_order?: number;
}
