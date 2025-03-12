
export interface ConcreteLabourCost {
  id: string;
  description: string;
  concrete_cost: number;
  dust_cost: number;
  total_cost: number;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ConcreteLabourCostInsert {
  description: string;
  concrete_cost: number;
  dust_cost: number;
  total_cost: number;
  display_order: number;
}
