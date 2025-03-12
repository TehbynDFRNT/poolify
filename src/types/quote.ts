
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
}
