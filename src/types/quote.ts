
export interface Quote {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  owner2_name?: string;
  owner2_email?: string;
  owner2_phone?: string;
  home_address: string;
  site_address: string;
  resident_homeowner?: boolean;
  pool_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
  crane_id?: string;
  traffic_control_id?: string;
  bobcat_id?: string;
  site_requirements_cost?: number;
  micro_dig_required: boolean;
  micro_dig_price: number;
  micro_dig_notes?: string;
  excavation_type?: string;
  web_price?: number;
  rrp?: number;
  total_cost?: number;
  extra_paving_cost?: number;
  concrete_pump_required?: boolean;
  concrete_pump_price?: number;
  concrete_cuts?: string;
  concrete_cuts_cost?: number;
  under_fence_strips_cost?: number;
  under_fence_strips_data?: any; // Changed from string to any to match Json type
  optional_addons_cost?: number;
  existing_concrete_paving?: string;
  existing_concrete_paving_cost?: number;
}

export interface QuoteInsert {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  owner2_name?: string;
  owner2_email?: string;
  owner2_phone?: string;
  home_address: string;
  site_address: string;
  resident_homeowner?: boolean;
  pool_id?: string;
  status: string;
  crane_id?: string;
  traffic_control_id?: string;
  bobcat_id?: string;
  site_requirements_cost?: number;
  micro_dig_required: boolean;
  micro_dig_price: number;
  micro_dig_notes?: string;
  excavation_type?: string;
  web_price?: number;
  rrp?: number;
  total_cost?: number;
  extra_paving_cost?: number;
  concrete_pump_required?: boolean;
  concrete_pump_price?: number;
  concrete_cuts?: string;
  concrete_cuts_cost?: number;
  under_fence_strips_cost?: number;
  under_fence_strips_data?: any; // Changed from string to any to match Json type
  optional_addons_cost?: number;
  existing_concrete_paving?: string;
  existing_concrete_paving_cost?: number;
}
