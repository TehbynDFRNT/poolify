
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

export interface HandoverKitPackage {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface HandoverKitPackageComponent {
  id: string;
  package_id: string;
  component_id: string;
  quantity: number;
  created_at: string;
  component?: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'>;
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

export interface PackageWithComponents extends Omit<FiltrationPackage, 'light_id' | 'pump_id' | 'sanitiser_id' | 'standard_filter_id' | 'media_filter_id' | 'handover_kit_id'> {
  light: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'> | null;
  pump: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'> | null;
  sanitiser: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'> | null;
  standard_filter: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'> | null;
  media_filter: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'> | null;
  handover_kit: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'> | null;
}
