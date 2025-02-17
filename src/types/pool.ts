
import { z } from "zod";

export const poolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  range: z.string().min(1, "Range is required"),
  length: z.coerce.number().min(0, "Length must be positive"),
  width: z.coerce.number().min(0, "Width must be positive"),
  depth_shallow: z.coerce.number().min(0, "Shallow depth must be positive"),
  depth_deep: z.coerce.number().min(0, "Deep depth must be positive"),
  waterline_l_m: z.coerce.number().nullable(),
  volume_liters: z.coerce.number().nullable(),
  salt_volume_bags: z.coerce.number().nullable(),
  salt_volume_bags_fixed: z.coerce.number().nullable(),
  weight_kg: z.coerce.number().nullable(),
  minerals_kg_initial: z.coerce.number().nullable(),
  minerals_kg_topup: z.coerce.number().nullable(),
  buy_price_ex_gst: z.coerce.number().nullable(),
  buy_price_inc_gst: z.coerce.number().nullable(),
});

export type PoolFormValues = z.infer<typeof poolSchema>;

export interface Pool {
  id: string;
  created_at: string;
  name: string;
  range: string;
  length: number;
  width: number;
  depth_shallow: number;
  depth_deep: number;
  waterline_l_m: number | null;
  volume_liters: number | null;
  salt_volume_bags: number | null;
  salt_volume_bags_fixed: number | null;
  weight_kg: number | null;
  minerals_kg_initial: number | null;
  minerals_kg_topup: number | null;
  buy_price_ex_gst: number | null;
  buy_price_inc_gst: number | null;
}

export type NewPool = Omit<Pool, 'id' | 'created_at'>;

export const POOL_RANGES = [
  'Piazza',
  'Latin',
  'Contemporary',
  'Vogue',
  'Villa',
  'Entertainer',
  'Round Pools'
] as const;
