
export interface PoolCleaner {
  id: string;
  name: string;
  description: string;
  model_number?: string;
  sku: string;
  trade: number;
  margin: number;
  rrp: number;
  price?: number;
  cost_price?: number;
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

export const calculateMarginValue = (rrp: number, trade: number): number => {
  if (rrp <= 0 || trade <= 0) return 0;
  return Number((rrp - trade).toFixed(2));
};
