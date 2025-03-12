
export interface ConcreteCut {
  id: string;
  cut_type: string;
  price: number;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ConcreteCutInsert {
  cut_type: string;
  price: number;
  display_order: number;
}
