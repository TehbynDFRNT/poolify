
export interface ConcreteLab {
  id: string;
  type: string;
  price: number;
  margin: number;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ConcreteLabInsert {
  type: string;
  price: number;
  margin: number;
  display_order: number;
}
