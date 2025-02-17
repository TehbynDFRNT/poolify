
export interface FiltrationComponentType {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface FiltrationComponent {
  id: string;
  model_number: string;
  name: string;
  description: string | null;
  type_id: string;
  price: number;
  flow_rate: number | null;
  power_consumption: number | null;
  created_at: string;
}

export interface FiltrationPackage {
  id: string;
  name: string;
  display_order: number;
  light_id: string | null;
  pump_id: string | null;
  sanitiser_id: string | null;
  standard_filter_id: string | null;
  media_filter_id: string | null;
  handover_kit_id: string | null;
  created_at: string;
}
