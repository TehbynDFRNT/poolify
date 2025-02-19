
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PackageWithComponents } from "@/types/filtration";
import { formatCurrency } from "@/utils/format";

interface PoolFiltrationProps {
  poolId: string;
}

export const PoolFiltration = ({ poolId }: PoolFiltrationProps) => {
  console.log("PoolFiltration component rendered with poolId:", poolId);
  
  const { data: filtrationPackage, isLoading, error } = useQuery({
    queryKey: ["pool-filtration-package", poolId],
    queryFn: async () => {
      console.log("Fetching filtration package for poolId:", poolId);
      
      const { data, error } = await supabase
        .from("pool_specifications")
        .select(`
          standard_filtration_package:filtration_packages!inner (
            id,
            name,
            display_order,
            light:filtration_components!filtration_packages_light_id_fkey (
              id, name, model_number, price
            ),
            pump:filtration_components!filtration_packages_pump_id_fkey (
              id, name, model_number, price
            ),
            sanitiser:filtration_components!filtration_packages_sanitiser_id_fkey (
              id, name, model_number, price
            ),
            filter:filtration_components!filtration_packages_filter_id_fkey (
              id, name, model_number, price
            ),
            handover_kit:handover_kit_packages!filtration_packages_handover_kit_id_fkey (
              id,
              name,
              components:handover_kit_package_components (
                quantity,
                component:filtration_components!handover_kit_package_components_component_id_fkey (
                  id, name, model_number, price
                )
              )
            )
          )
        `)
        .eq('id', poolId)
        .single();

      console.log("Filtration package query result:", { data, error });

      if (error) {
        console.error("Error fetching filtration package:", error);
        throw error;
      }

      return data?.standard_filtration_package as PackageWithComponents;
    }
  });

  console.log("Filtration package data:", filtrationPackage);
  console.log("Loading:", isLoading);
  console.log("Error:", error);

  if (isLoading) {
    return <div>Loading filtration package...</div>;
  }

  if (error) {
    return <div>Error loading filtration package</div>;
  }

  if (!filtrationPackage) {
    return <div>No filtration package assigned to this pool</div>;
  }

  const calculateHandoverKitTotal = () => {
    return filtrationPackage.handover_kit?.components.reduce((total, comp) => {
      return total + ((comp.component?.price || 0) * comp.quantity);
    }, 0) || 0;
  };

  const calculatePackageTotal = () => {
    const handoverKitTotal = calculateHandoverKitTotal();
    return (
      (filtrationPackage.light?.price || 0) +
      (filtrationPackage.pump?.price || 0) +
      (filtrationPackage.sanitiser?.price || 0) +
      (filtrationPackage.filter?.price || 0) +
      handoverKitTotal
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Filtration Package - Option {filtrationPackage.display_order}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filtrationPackage.light && (
          <div className="flex justify-between text-sm">
            <span>Light - {filtrationPackage.light.name}</span>
            <span>{formatCurrency(filtrationPackage.light.price)}</span>
          </div>
        )}
        {filtrationPackage.pump && (
          <div className="flex justify-between text-sm">
            <span>Pump - {filtrationPackage.pump.name}</span>
            <span>{formatCurrency(filtrationPackage.pump.price)}</span>
          </div>
        )}
        {filtrationPackage.sanitiser && (
          <div className="flex justify-between text-sm">
            <span>Sanitiser - {filtrationPackage.sanitiser.name}</span>
            <span>{formatCurrency(filtrationPackage.sanitiser.price)}</span>
          </div>
        )}
        {filtrationPackage.filter && (
          <div className="flex justify-between text-sm">
            <span>Filter - {filtrationPackage.filter.name}</span>
            <span>{formatCurrency(filtrationPackage.filter.price)}</span>
          </div>
        )}
        {filtrationPackage.handover_kit && (
          <>
            <div className="text-sm font-medium pt-2">Handover Kit - {filtrationPackage.handover_kit.name}</div>
            {filtrationPackage.handover_kit.components.map((component) => (
              <div key={component.component?.id} className="flex justify-between text-sm pl-4">
                <span>{component.component?.name} (x{component.quantity})</span>
                <span>{formatCurrency((component.component?.price || 0) * component.quantity)}</span>
              </div>
            ))}
          </>
        )}
        <div className="flex justify-between font-medium pt-4 border-t">
          <span>Total Filtration Cost:</span>
          <span>{formatCurrency(calculatePackageTotal())}</span>
        </div>
      </CardContent>
    </Card>
  );
};
