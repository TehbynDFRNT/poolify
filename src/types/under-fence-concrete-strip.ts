
export interface UnderFenceConcreteStrip {
  id: string;
  type: string;
  cost: number;
  margin: number;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface UnderFenceConcreteStripInsert {
  type: string;
  cost: number;
  margin: number;
  display_order: number;
}
