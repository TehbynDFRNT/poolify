
export interface WaterFeature {
  id: string;
  name: string;
  description: string;
  price: number;
  margin: number;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface WaterFeatureInsert {
  name: string;
  description: string;
  price: number;
  margin: number;
  display_order: number;
}
