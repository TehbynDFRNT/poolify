
import { TableRow, TableCell } from "@/components/ui/table";
import { Pool } from "@/types/pool";
import { CellRenderer } from "./cell-renderers/CellRenderer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PoolTableRowProps {
  pool: Pool;
  getVisibleColumns: () => string[];
  poolCosts: Map<string, any>;
}

export const PoolTableRow = ({ 
  pool, 
  getVisibleColumns, 
  poolCosts 
}: PoolTableRowProps) => {
  const columns = getVisibleColumns();
  const poolCost = poolCosts?.get(pool.id) || {};
  
  // Fetch the filtration package data for this pool
  const { data: packageInfo } = useQuery({
    queryKey: ["filtration-package", pool.id, pool.default_filtration_package_id],
    queryFn: async () => {
      if (!pool.default_filtration_package_id) return null;
      
      const { data, error } = await supabase
        .from("filtration_packages")
        .select(`
          id,
          name,
          display_order,
          light:filtration_components!light_id (
            id, name, model_number, price
          ),
          pump:filtration_components!pump_id (
            id, name, model_number, price
          ),
          sanitiser:filtration_components!sanitiser_id (
            id, name, model_number, price
          ),
          filter:filtration_components!filter_id (
            id, name, model_number, price
          ),
          handover_kit:handover_kit_packages!handover_kit_id (
            id, 
            name,
            components:handover_kit_package_components (
              id,
              quantity,
              package_id,
              component_id,
              created_at,
              component:filtration_components!component_id (
                id,
                name,
                model_number,
                price
              )
            )
          )
        `)
        .eq('id', pool.default_filtration_package_id)
        .single();

      if (error) return null;
      return data;
    },
    enabled: !!pool.default_filtration_package_id,
  });
  
  return (
    <TableRow key={pool.id}>
      {columns.map((column) => (
        <TableCell key={`${pool.id}-${column}`}>
          <CellRenderer 
            pool={pool} 
            column={column} 
            poolCost={poolCost} 
            packageInfo={packageInfo}
          />
        </TableCell>
      ))}
    </TableRow>
  );
};
