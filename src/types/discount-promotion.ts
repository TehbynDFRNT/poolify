export type DiscountType = 'dollar' | 'percentage';

/** Common columns */
interface DiscountPromotionBase {
  uuid: string;
  discount_name: string;
  created_at: string;          // or Date
}

export interface DollarDiscountPromotion extends DiscountPromotionBase {
  discount_type: 'dollar';
  dollar_value: number;        // required
  percentage_value?: undefined;
}

export interface PercentageDiscountPromotion extends DiscountPromotionBase {
  discount_type: 'percentage';
  percentage_value: number;    // required
  dollar_value?: undefined;
}

/** Union you pass around */
export type DiscountPromotion =
  | DollarDiscountPromotion
  | PercentageDiscountPromotion;

/** For inserts/updates (no uuid/created_at on the caller side) */
export type EditableDiscountPromotion =
  | Omit<DollarDiscountPromotion, 'uuid' | 'created_at'>
  | Omit<PercentageDiscountPromotion, 'uuid' | 'created_at'>;

/* ─────────────────────────────────────────────── */

export interface PoolDiscount {
  id: string;
  pool_project_id: string;
  discount_promotion_uuid: string;
  created_at: string;
}

export type EditablePoolDiscount = Omit<PoolDiscount, 'id' | 'created_at'>;
