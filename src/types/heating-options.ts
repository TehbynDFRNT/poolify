
export interface HeatingInstallation {
  id: string;
  installation_type: string;
  installation_cost: number;
  installation_inclusions: string;
  created_at: string;
}

export interface PoolHeatingOptions {
  id: string;
  customer_id: string;
  pool_id: string;
  include_heat_pump: boolean;
  include_blanket_roller: boolean;
  heat_pump_id: string | null;
  blanket_roller_id: string | null;
  heat_pump_cost: number;
  blanket_roller_cost: number;
  total_cost: number;
  total_margin: number;
  created_at: string;
  updated_at: string;
}
