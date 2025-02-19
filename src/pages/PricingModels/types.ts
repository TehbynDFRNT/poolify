
import type { Pool } from "@/types/pool";
import type { FiltrationComponent } from "@/types/filtration";

export type SupabasePoolResponse = Pool & {
  standard_filtration_package: {
    id: string;
    name: string;
    display_order: number;
    created_at: string;
    light: Pick<FiltrationComponent, 'id' | 'name' | 'model_number' | 'price'> | null;
    pump: Pick<FiltrationComponent, 'id' | 'name' | 'model_number' | 'price'> | null;
    sanitiser: Pick<FiltrationComponent, 'id' | 'name' | 'model_number' | 'price'> | null;
    filter: Pick<FiltrationComponent, 'id' | 'name' | 'model_number' | 'price'> | null;
    handover_kit: {
      id: string;
      name: string;
      components: {
        quantity: number;
        component: Pick<FiltrationComponent, 'id' | 'name' | 'model_number' | 'price'>;
      }[];
    } | null;
  } | null;
};
