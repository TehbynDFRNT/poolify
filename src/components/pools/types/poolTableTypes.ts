
import { Pool } from "@/types/pool";

export type NullableNumericFields = 
  | "waterline_l_m"
  | "volume_liters"
  | "salt_volume_bags"
  | "salt_volume_bags_fixed"
  | "weight_kg"
  | "minerals_kg_initial"
  | "minerals_kg_topup"
  | "buy_price_ex_gst"
  | "buy_price_inc_gst";

export type RequiredNumericFields =
  | "length"
  | "width"
  | "depth_shallow"
  | "depth_deep";

export type PoolUpdateFieldType<K extends keyof Pool> = K extends NullableNumericFields 
  ? number | null 
  : K extends RequiredNumericFields
    ? number
    : K extends "name" | "range"
      ? string
      : Pool[K];

export type PoolUpdates = {
  [K in keyof Partial<Pool>]: PoolUpdateFieldType<K>;
};

export const editableFields: (keyof Pool)[] = [
  "name",
  "range",
  "length",
  "width",
  "depth_shallow",
  "depth_deep",
  "waterline_l_m",
  "volume_liters",
  "salt_volume_bags",
  "salt_volume_bags_fixed",
  "weight_kg",
  "minerals_kg_initial",
  "minerals_kg_topup",
  "buy_price_ex_gst",
  "buy_price_inc_gst"
];
