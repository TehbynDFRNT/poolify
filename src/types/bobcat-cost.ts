
export interface BobcatCost {
  id: string;
  size_category: string;
  day_code: string;
  price: number;
  display_order: number;
  created_at: string;
}

export interface EditableBobcatCost extends Omit<BobcatCost, 'id' | 'created_at'> {}
