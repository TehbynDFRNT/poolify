
export interface ExcavationRate {
  id: string;
  category: 'truck' | 'excavation';
  hourly_rate: number;
  created_at: string;
}

export interface PoolExcavationDetails {
  id: string;
  pool_id: string;
  truck_hours: number;
  truck_quantity: number;
  excavation_hours: number;
  created_at: string;
  updated_at: string;
}

export interface ExcavationCosts {
  truckSubtotal: number;
  excavationSubtotal: number;
  total: number;
}
