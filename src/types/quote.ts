
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
  pool_id?: string;
  status: 'draft' | 'pending' | 'approved' | 'declined';
  created_at: string;
  updated_at?: string;
  resident_homeowner?: boolean;
  
  // These fields now exist in the database schema
  crane_id?: string;
  excavation_type?: string;
  traffic_control_id?: string;
  site_requirements_cost?: number;
  optional_addons_cost?: number;
  total_cost?: number;
  
  // New fields for custom requirements and micro dig
  custom_requirements_json?: string;
  micro_dig_required?: boolean;
  micro_dig_price?: number;
  micro_dig_notes?: string;
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
  pool_id?: string;
  status: 'draft' | 'pending' | 'approved' | 'declined';
  resident_homeowner?: boolean;
  crane_id?: string;
  excavation_type?: string;
  traffic_control_id?: string;
  site_requirements_cost?: number;
  optional_addons_cost?: number;
  total_cost?: number;
  custom_requirements_json?: string;
  micro_dig_required?: boolean;
  micro_dig_price?: number;
  micro_dig_notes?: string;
}
