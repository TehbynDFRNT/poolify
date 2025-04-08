
import { z } from "zod";

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

// Create a proper Zod schema for pool form validation
export const poolSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  range: z.string().min(1, { message: "Range is required" }),
  length: z.number().positive({ message: "Length must be a positive number" }),
  width: z.number().positive({ message: "Width must be a positive number" }),
  depth_shallow: z.number().positive({ message: "Shallow depth must be a positive number" }),
  depth_deep: z.number().positive({ message: "Deep depth must be a positive number" }),
  waterline_l_m: z.number().optional(),
  volume_liters: z.number().optional(),
  salt_volume_bags: z.number().optional(),
  salt_volume_bags_fixed: z.number().optional(),
  weight_kg: z.number().optional(),
  minerals_kg_initial: z.number().optional(),
  minerals_kg_topup: z.number().optional(),
  buy_price_ex_gst: z.number().optional(),
  buy_price_inc_gst: z.number().optional()
});
