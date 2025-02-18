
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
  component?: Pick<FiltrationComponent, 'name' | 'model_number' | 'price' | 'id'>;
}

export interface FiltrationPackage {
  id: string;
  name: string;
  display_order: number;
  light_id: string | null;
  pump_id: string | null;
  sanitiser_id: string | null;
  filter_id: string | null;
  handover_kit_id: string | null;
  created_at: string;
}

export interface PackageWithComponents extends Omit<FiltrationPackage, 'light_id' | 'pump_id' | 'sanitiser_id' | 'filter_id' | 'handover_kit_id'> {
  light: Pick<FiltrationComponent, 'name' | 'model_number' | 'price' | 'id'> | null;
  pump: Pick<FiltrationComponent, 'name' | 'model_number' | 'price' | 'id'> | null;
  sanitiser: Pick<FiltrationComponent, 'name' | 'model_number' | 'price' | 'id'> | null;
  filter: Pick<FiltrationComponent, 'name' | 'model_number' | 'price' | 'id'> | null;
  handover_kit: Pick<FiltrationComponent, 'name' | 'model_number' | 'price' | 'id'> | null;
}
