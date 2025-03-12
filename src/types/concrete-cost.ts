
export interface ConcreteCost {
  id: string;
  description: string;
  concrete_cost: number;
  dust_cost: number;
  total_cost: number;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ConcreteCostInsert {
  description: string;
  concrete_cost: number;
  dust_cost: number;
  total_cost: number;
  display_order: number;
}
