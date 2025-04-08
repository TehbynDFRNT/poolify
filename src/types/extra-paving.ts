
export interface ExtraPavingCost {
  id: string;
  category: string;
  paver_cost: number;
  wastage_cost: number;
  margin_cost: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ExtraPavingCostInsert {
  category: string;
  paver_cost: number;
  wastage_cost: number;
  margin_cost: number;
  display_order: number;
}
