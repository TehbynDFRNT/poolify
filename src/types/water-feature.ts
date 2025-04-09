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

export interface PoolWaterFeature {
  id: string;
  pool_id: string;
  customer_id: string;
  water_feature_size: string;
  back_cladding_needed: boolean;
  front_finish: string;
  top_finish: string;
  sides_finish: string;
  led_blade: string;
  total_cost: number;
  created_at: string;
  updated_at?: string;
}

export interface PoolWaterFeatureInsert {
  pool_id: string;
  customer_id: string;
  water_feature_size: string;
  back_cladding_needed: boolean;
  front_finish: string;
  top_finish: string;
  sides_finish: string;
  led_blade: string;
  total_cost: number;
}

export interface WaterFeatureFormValues {
  waterFeatureSize: string;
  backCladdingNeeded: boolean;
  frontFinish: string;
  topFinish: string;
  sidesFinish: string;
  ledBlade: string;
}

export interface WaterFeatureSummary {
  basePrice: number;
  baseMargin: number;
  backCladdingPrice: number;
  backCladdingMargin: number;
  bladePrice: number;
  bladeMargin: number;
  totalCost: number;
  selectedBladeName: string;
}
