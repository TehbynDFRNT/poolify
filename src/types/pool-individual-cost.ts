
export interface PoolIndividualCost {
  id: string;
  name: string;
  range: string;
  cost_value: number;
  description: string | null;
  is_active: boolean;
  notes: string | null;
  display_order: number;
  created_at: string;
}
