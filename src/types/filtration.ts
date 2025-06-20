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
  price_inc_gst: number;
  price_ex_gst: number;
  created_at: string;
}

export interface HandoverKitPackage {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
  components?: HandoverKitPackageComponent[];
}

export interface HandoverKitPackageComponent {
  id: string;
  package_id: string;
  component_id: string;
  quantity: number;
  created_at: string;
  component?: Pick<FiltrationComponent, 'name' | 'model_number' | 'price_inc_gst' | 'id'>;
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

export interface PackageWithComponents {
  id: string;
  name: string;
  display_order: number;
  light?: Pick<FiltrationComponent, 'name' | 'model_number' | 'price_inc_gst' | 'id'> | null;
  pump?: Pick<FiltrationComponent, 'name' | 'model_number' | 'price_inc_gst' | 'id'> | null;
  sanitiser?: Pick<FiltrationComponent, 'name' | 'model_number' | 'price_inc_gst' | 'id'> | null;
  filter?: Pick<FiltrationComponent, 'name' | 'model_number' | 'price_inc_gst' | 'id'> | null;
  handover_kit?: (Pick<HandoverKitPackage, 'name' | 'id'> & {
    components: (HandoverKitPackageComponent & {
      component: Pick<FiltrationComponent, 'name' | 'model_number' | 'price_inc_gst' | 'id'>;
    })[];
  }) | null;
}

export interface PoolProjectFiltrationPackage {
  id: string;
  pool_project_id: string;
  filtration_package_id: string;
  created_at: string;
  updated_at: string;
}
