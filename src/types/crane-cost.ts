
export interface CraneCost {
  id: string;
  name: string;
  price: number;
  display_order: number;
  created_at: string;
}

export interface EditableCraneCost extends Omit<CraneCost, 'id' | 'created_at'> {}
