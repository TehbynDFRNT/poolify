
export type FenceCategory = 'Fencing' | 'Gates' | 'Earthing' | 'Retaining';
export type FenceType = 'Fence (per meter)' | 'Gate (per unit)' | 'Per meter' | 'Per job';

export interface FencingCost {
  id: string;
  item: string;
  type: FenceType;
  unit_price: number;
  created_at?: string;
  display_order?: number;
  category: FenceCategory;
}

export type FencingCostInsert = Omit<FencingCost, 'id' | 'created_at'>;

export const FENCE_CATEGORIES: FenceCategory[] = ['Fencing', 'Gates', 'Earthing', 'Retaining'];
export const FENCE_TYPES: FenceType[] = ['Fence (per meter)', 'Gate (per unit)', 'Per meter', 'Per job'];
