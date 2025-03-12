
export interface Quote {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
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
  location: string;
  desired_timeline: string;
  pool_id?: string;
  status: 'draft' | 'pending' | 'approved' | 'declined';
}
