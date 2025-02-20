
export interface DigType {
  id: string;
  name: string;
  cost: number;
  created_at: string;
}

export interface PoolDigType {
  id: string;
  pool_name: string;
  pool_range: string;
  dig_type_id: string;
  created_at: string;
  dig_type?: DigType;
}
