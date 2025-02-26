
export interface FencingCost {
  id: string;
  item: string;
  type: string;
  unit_price: number;
  created_at?: string;
  display_order?: number;
  category: string;
}

export type FencingCostInsert = Omit<FencingCost, 'id' | 'created_at'>;

export const FENCE_CATEGORIES = ['Fencing', 'Gates', 'Earthing', 'Retaining'] as const;
export const FENCE_TYPES = ['Fence (per meter)', 'Gate (per unit)', 'Per meter'] as const;
