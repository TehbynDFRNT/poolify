
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
  installation_area: string;
  proposal_name?: string;
  resident_homeowner?: boolean;
  location: string;
  desired_timeline: string;
  pool_id?: string;
  status: 'draft' | 'pending' | 'approved' | 'declined';
  created_at: string;
  updated_at?: string;
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
  installation_area: string;
  proposal_name?: string;
  resident_homeowner?: boolean;
  location: string;
  desired_timeline: string;
  pool_id?: string;
  status: 'draft' | 'pending' | 'approved' | 'declined';
}
