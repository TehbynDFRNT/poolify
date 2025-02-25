
export interface FencingCost {
  id: string;
  item: string;
  type: string;
  unit_price: number;
  created_at?: string;
  display_order?: number;
}

export type FencingCostInsert = Omit<FencingCost, 'id' | 'created_at'>;
