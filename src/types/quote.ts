
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
  
  // Site requirements fields
  crane_id?: string;
  excavation_type?: string;
  traffic_control_id?: string;
  site_requirements_cost?: number;
  optional_addons_cost?: number;
  total_cost?: number;
  
  // Micro dig fields
  micro_dig_required: boolean;
  micro_dig_price: number;
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
  micro_dig_required: boolean;
  micro_dig_price: number;
  micro_dig_notes?: string;
}
