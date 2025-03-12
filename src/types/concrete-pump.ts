
export interface ConcretePump {
  id: string;
  price: number;
  created_at: string;
  updated_at?: string;
}

export interface ConcretePumpInsert {
  price: number;
}
