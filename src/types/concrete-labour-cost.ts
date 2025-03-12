
export interface ConcreteLabourCost {
  id: string;
  description: string;
  cost: number;
  margin: number;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ConcreteLabourCostInsert {
  description: string;
  cost: number;
  margin: number;
  display_order: number;
}
