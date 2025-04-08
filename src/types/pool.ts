export interface Pool {
  id: string;
  name: string;
  description: string;
  length: number;
  width: number;
  depth_shallow: number;
  depth_deep: number;
  volume: number;
  perimeter: number;
  surface_area: number;
  price_base: number;
  price_excavation: number;
  price_plumbing: number;
  price_electrical: number;
  price_installation: number;
  price_coping: number;
  price_equipment: number;
  price_filtration: number;
  price_heater: number;
  price_lights: number;
  price_cleaning: number;
  price_chemicals: number;
  price_winterizing: number;
  price_warranty: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PoolProject {
  id: string;
  owner1: string;
  owner2?: string;
  email: string;
  phone: string;
  home_address: string;
  site_address?: string;
  proposal_name: string;
  installation_area: string;
  resident_homeowner: boolean;
  pool_specification_id?: string;
  pool_color?: string;
  crane_id?: string;
  traffic_control_id?: string;
  bobcat_id?: string;
  site_requirements_data?: any[];
  site_requirements_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface PoolSelection {
  id: string;
  customer_id: string;
  pool_id: string;
  color: string;
  created_at: string;
}
