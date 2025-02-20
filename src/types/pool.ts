
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
}
