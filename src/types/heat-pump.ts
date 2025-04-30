
export interface HeatPumpPoolMatch {
  id: string;
  pool_range: string;
  pool_model: string;
  heat_pump_id: string;
  hp_sku: string;
  hp_description: string;
  cost: number;
  margin: number;
  rrp: number;
  created_at?: string;
  updated_at?: string;
}
