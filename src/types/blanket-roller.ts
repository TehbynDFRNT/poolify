
export interface BlanketRoller {
  id: string;
  pool_range: string;
  pool_model: string;
  sku: string;
  description: string;
  rrp: number;
  trade: number;
  margin: number;
  created_at: string;
}

export const calculateMarginValue = (rrp: number, trade: number): number => {
  return rrp - trade;
};
