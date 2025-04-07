
import { z } from "zod";

export interface Pool {
  id: string;
  name: string;
  range: string;
  length: number;
  width: number;
  depth_shallow: number;
  depth_deep: number;
  pool_type_id?: string;
  default_filtration_package_id?: string;
  buy_price_ex_gst?: number;
  buy_price_inc_gst?: number;
  minerals_kg_initial?: number;
  minerals_kg_topup?: number;
  weight_kg?: number;
  salt_volume_bags?: number;
  salt_volume_bags_fixed?: number;
  waterline_l_m?: number;
  volume_liters?: number;
  color?: string;
}

// Add the pool ranges constant
export const POOL_RANGES = [
  "Composite",
  "Fibreglass",
  "Concrete",
  "Other"
] as const;

// Define the pool colors
export const POOL_COLORS = [
  "Silver Mist",
  "Horizon",
  "Twilight"
] as const;

// Define the schema for form validation
export const poolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  range: z.string().min(1, "Range is required"),
  length: z.number().min(0, "Length must be positive"),
  width: z.number().min(0, "Width must be positive"),
  depth_shallow: z.number().min(0, "Shallow depth must be positive"),
  depth_deep: z.number().min(0, "Deep depth must be positive"),
  waterline_l_m: z.number().nullable(),
  volume_liters: z.number().nullable(),
  salt_volume_bags: z.number().nullable(),
  salt_volume_bags_fixed: z.number().nullable(),
  weight_kg: z.number().nullable(),
  minerals_kg_initial: z.number().nullable(),
  minerals_kg_topup: z.number().nullable(),
  buy_price_ex_gst: z.number().nullable(),
  buy_price_inc_gst: z.number().nullable(),
  pool_type_id: z.string().optional(),
  default_filtration_package_id: z.string().optional(),
  color: z.string().optional(),
});

// Export the type for the form values
export type PoolFormValues = z.infer<typeof poolSchema>;
