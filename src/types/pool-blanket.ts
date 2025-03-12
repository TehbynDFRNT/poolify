
export interface PoolBlanket {
  id: string;
  pool_range: string;
  pool_model: string;
  blanket_sku: string;
  blanket_description: string;
  blanket_rrp: number;
  blanket_trade: number;
  blanket_margin: number;
  heatpump_sku: string;
  heatpump_description: string;
  heatpump_rrp: number;
  heatpump_trade: number;
  heatpump_margin: number;
  created_at: string;
}

export const calculateMarginPercentage = (rrp: number, trade: number): number => {
  if (trade === 0) return 0;
  return ((rrp - trade) / rrp) * 100;
};
