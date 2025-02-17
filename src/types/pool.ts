
import { z } from "zod";

export const poolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dig_level: z.string().min(1, "Dig level is required"),
  pool_type_id: z.string().min(1, "Pool type is required"),
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

export interface Pool extends PoolFormValues {
  id: string;
  created_at: string;
  pool_type?: {
    id: string;
    name: string;
  };
}

export interface PoolType {
  id: string;
  name: string;
}
