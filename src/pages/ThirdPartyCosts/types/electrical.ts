
export interface ElectricalCost {
  id: string;
  description: string;
  rate: number;
  display_order: number;
}

export type ElectricalCostInsert = {
  description: string;
  rate: number;
  display_order?: number;
}

export interface PoolElectricalRequirements {
  id: string;
  pool_id: string;
  customer_id: string;
  standard_power: boolean;
  fence_earthing: boolean;
  heat_pump_circuit: boolean;
  total_cost: number;
  created_at: string;
  updated_at: string;
}
