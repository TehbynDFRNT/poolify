
export interface Quote {
  id: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  owner2_name?: string;
  owner2_email?: string;
  owner2_phone?: string;
  site_address: string;
  home_address: string;
  status: string;
  pool_id?: string;
  web_price?: number;
  rrp?: number;
  total_cost?: number;
  site_requirements_cost?: number;
  optional_addons_cost?: number;
  extra_paving_cost?: number;
  concrete_cuts?: string;
  concrete_pump_required?: boolean;
  concrete_pump_price?: number;
  concrete_cuts_cost?: number;
  bobcat_id?: string;
  crane_id?: string;
  traffic_control_id?: string;
  resident_homeowner?: boolean;
  under_fence_strips_cost?: number;
  under_fence_strips_data?: string;
  micro_dig_required?: boolean;
  micro_dig_price?: number;
  micro_dig_notes?: string;
  excavation_type?: string;
  // New fields for paving on existing concrete
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
  site_address: string;
  home_address: string;
  status: string;
  resident_homeowner?: boolean;
}
