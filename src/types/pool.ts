
export interface Pool {
  id: string;
  name: string;
  description: string;
  length: number;
  width: number;
  depth_shallow: number;
  depth_deep: number;
  volume: number;
  perimeter: number;
  surface_area: number;
  price_base: number;
  price_excavation: number;
  price_plumbing: number;
  price_electrical: number;
  price_installation: number;
  price_coping: number;
  price_equipment: number;
  price_filtration: number;
  price_heater: number;
  price_lights: number;
  price_cleaning: number;
  price_chemicals: number;
  price_winterizing: number;
  price_warranty: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Additional properties from pool_specifications table
  range?: string;
  pool_type_id?: string;
  default_filtration_package_id?: string;
  weight_kg?: number;
  volume_liters?: number;
  waterline_l_m?: number;
  salt_volume_bags?: number;
  salt_volume_bags_fixed?: number;
  minerals_kg_initial?: number;
  minerals_kg_topup?: number;
  buy_price_ex_gst?: number;
  buy_price_inc_gst?: number;
  color?: string;
  dig_level?: string;
  dig_type_id?: string;
  outline_image_url?: string;
}

export interface PoolProject {
  id: string;
  owner1: string;
  owner2?: string;
  email: string;
  phone: string;
  home_address: string;
  site_address?: string;
  proposal_name: string;
  installation_area: string;
  resident_homeowner: boolean;
  pool_specification_id?: string;
  pool_color?: string;
  crane_id?: string;
  traffic_control_id?: string;
  bobcat_id?: string;
  site_requirements_data?: any[];
  site_requirements_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PoolSelection {
  id: string;
  customer_id: string;
  pool_id: string;
  color: string;
  created_at: string;
}

// Add the missing POOL_COLORS constant
export const POOL_COLORS = [
  "Silver Mist",
  "Horizon",
  "Twilight"
];

// Add missing POOL_RANGES constant
export const POOL_RANGES = [
  "Oasis",
  "Riviera",
  "Sanctuary",
  "Serenity",
  "Tranquility"
];

// Export schema and form types used in other parts of the app
export interface PoolFormValues {
  name: string;
  range: string;
  length: number;
  width: number;
  depth_shallow: number;
  depth_deep: number;
  waterline_l_m?: number;
  volume_liters?: number;
  salt_volume_bags?: number;
  salt_volume_bags_fixed?: number;
  weight_kg?: number;
  minerals_kg_initial?: number;
  minerals_kg_topup?: number;
  buy_price_ex_gst?: number;
  buy_price_inc_gst?: number;
}

export const poolSchema = {
  // This is a placeholder. The actual schema would be defined using Zod or another validation library
  // Projects referencing this likely have their own implementation
};
