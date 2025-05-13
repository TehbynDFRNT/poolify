
export interface PoolCleaner {
  id: string;
  name: string;
  model_number?: string;
  description?: string;
  sku?: string;
  rrp: number;
  trade: number;
  margin?: number;
  created_at?: string;
  updated_at?: string;
}

// Helper function to calculate margin value
export const calculateMarginValue = (rrp: number, trade: number): number => {
  return rrp - trade;
};
