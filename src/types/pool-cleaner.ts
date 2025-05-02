
export interface PoolCleaner {
  id: string;
  name: string;
  description: string;
  sku: string;
  trade: number;
  margin: number;
  rrp: number;
  created_at?: string;
}

export interface PoolCleanerOptions {
  id?: string;
  customer_id: string;
  pool_id: string;
  include_cleaner: boolean;
  cleaner_id: string | null;
  cleaner_cost: number;
  cleaner_margin: number;
  created_at?: string;
  updated_at?: string;
}
