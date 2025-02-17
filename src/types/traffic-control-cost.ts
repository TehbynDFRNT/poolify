
export interface TrafficControlCost {
  id: string;
  name: string;
  price: number;
  display_order: number;
  created_at: string;
}

export interface EditableTrafficControlCost extends Omit<TrafficControlCost, 'id' | 'created_at'> {}
