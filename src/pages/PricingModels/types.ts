
import type { 
  FiltrationComponent, 
  HandoverKitPackage, 
  HandoverKitPackageComponent 
} from "@/types/filtration";

export interface SupabaseFiltrationPackageResponse {
  id: string;
  name: string;
  display_order: number;
  light: Pick<FiltrationComponent, 'id' | 'name' | 'model_number' | 'price'> | null;
  pump: Pick<FiltrationComponent, 'id' | 'name' | 'model_number' | 'price'> | null;
  sanitiser: Pick<FiltrationComponent, 'id' | 'name' | 'model_number' | 'price'> | null;
  filter: Pick<FiltrationComponent, 'id' | 'name' | 'model_number' | 'price'> | null;
  handover_kit: (Pick<HandoverKitPackage, 'id' | 'name'> & {
    components: (HandoverKitPackageComponent & {
      component: Pick<FiltrationComponent, 'id' | 'name' | 'model_number' | 'price'>;
    })[];
  }) | null;
}

export interface SupabasePoolResponse {
  id: string;
  name: string;
  range: string;
  length: number;
  width: number;
  depth_shallow: number;
  depth_deep: number;
  buy_price_ex_gst: number | null;
  buy_price_inc_gst: number | null;
  waterline_l_m: number | null;
  volume_liters: number | null;
  salt_volume_bags: number | null;
  salt_volume_bags_fixed: number | null;
  weight_kg: number | null;
  minerals_kg_initial: number | null;
  minerals_kg_topup: number | null;
  standard_filtration_package: SupabaseFiltrationPackageResponse | null;
}
