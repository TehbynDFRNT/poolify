
export interface ExcavationDigType {
  id: string;
  name: string;
  created_at: string;
  truck_count: number;
  truck_hourly_rate: number;
  truck_hours: number;
  excavation_hourly_rate: number;
  excavation_hours: number;
}

export interface PoolExcavationType {
  id: string;
  name: string;
  range: string;
  dig_type_id: string;
  created_at: string;
  dig_type?: ExcavationDigType;
}
