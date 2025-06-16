export type DiscountType = 'dollar' | 'percentage';

export interface DiscountPromotion {
  uuid: string;
  discount_name: string;
  discount_type: DiscountType;
  dollar_value?: number;
  percentage_value?: number;
  created_at: string;
}

export interface EditableDiscountPromotion {
  discount_name: string;
  discount_type: DiscountType;
  dollar_value?: number;
  percentage_value?: number;
}

export interface PoolDiscount {
  id: string;
  pool_project_id: string;
  discount_promotion_uuid: string;
  created_at: string;
}

export interface EditablePoolDiscount {
  pool_project_id: string;
  discount_promotion_uuid: string;
}