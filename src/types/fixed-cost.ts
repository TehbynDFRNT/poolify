
export interface FixedCost {
  id: string;
  name: string;
  price: number;
  display_order: number;
  created_at: string;
}

export interface EditableFixedCost {
  name: string;
  price: number;
  display_order: number;
}
