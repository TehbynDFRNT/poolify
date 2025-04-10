
export interface ElectricalOption {
  id: string;
  description: string;
  rate: number;
  isSelected: boolean;
}

export interface ElectricalData {
  id?: string;
  pool_id: string;
  customer_id: string;
  standard_power: boolean;
  fence_earthing: boolean;
  heat_pump_circuit: boolean;
  total_cost: number;
  created_at?: string;
  updated_at?: string;
}
