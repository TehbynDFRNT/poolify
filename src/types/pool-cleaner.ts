
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
  // Adding price and cost_price as aliases to maintain compatibility
  price?: number;
  cost_price?: number;
}

// Helper function to calculate margin value
export const calculateMarginValue = (rrp: number, trade: number): number => {
  return rrp - trade;
};

// Helper function to map database fields to our PoolCleaner interface
export const mapDbToPoolCleaner = (data: any): PoolCleaner => {
  return {
    id: data.id,
    name: data.name,
    model_number: data.model_number,
    description: data.description,
    sku: data.model_number, // Use model_number as SKU if needed
    rrp: data.price || 0,
    trade: data.cost_price || 0,
    margin: data.margin,
    created_at: data.created_at,
    updated_at: data.updated_at,
    price: data.price,
    cost_price: data.cost_price
  };
};
