
export interface BlanketRoller {
  id: string;
  pool_model: string;
  pool_range: string;
  description: string;
  sku: string;
  trade: number;
  margin: number;
  rrp: number;
  created_at: string;
}

export const calculateMarginValue = (rrp: number, trade: number): number => {
  if (rrp <= 0 || trade <= 0) return 0;
  return Number((rrp - trade).toFixed(2));
};

