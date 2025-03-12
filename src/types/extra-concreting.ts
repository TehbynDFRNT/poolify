
export interface ExtraConcreting {
  id: string;
  type: string;
  price: number;
  margin: number;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface ExtraConcretingInsert {
  type: string;
  price: number;
  margin: number;
  display_order: number;
}
