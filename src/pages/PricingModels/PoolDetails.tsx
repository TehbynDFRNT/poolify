
import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Pool } from "@/types/pool";
import type { PackageWithComponents } from "@/types/filtration";
import { useState, useEffect } from "react";
import { PoolBreadcrumb } from "./components/PoolBreadcrumb";
import { PoolHeader } from "./components/PoolHeader";
import { PoolOutline } from "./components/PoolOutline";
import { PoolSpecifications } from "./components/PoolSpecifications";
import { FiltrationPackage } from "./components/FiltrationPackage";
import { PoolCosts } from "./components/PoolCosts";
import { FixedCosts } from "./components/FixedCosts";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { initialPoolCosts, poolDigTypeMap } from "@/pages/ConstructionCosts/constants";
import { toast } from "sonner";

const PoolDetails = () => {
  const { id } = useParams();
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: pool, isLoading: poolLoading } = useQuery({
    queryKey: ["pool-specification", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select(`
          *,
          standard_filtration_package: standard_filtration_package_id (
            id,
            name,
            display_order,
            created_at,
            light: light_id ( id, name, model_number, price ),
            pump: pump_id ( id, name, model_number, price ),
            sanitiser: sanitiser_id ( id, name, model_number, price ),
            filter: filter_id ( id, name, model_number, price ),
            handover_kit: handover_kit_id (
              id,
              name,
              components: handover_kit_package_components (
                quantity,
                component: component_id ( id, name, model_number, price )
              )
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as unknown as Pool & { standard_filtration_package: PackageWithComponents | null };
    },
  });

  const { data: filtrationPackages, isLoading: packagesLoading } = useQuery({
    queryKey: ["filtration-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("filtration_packages")
        .select(`
          id,
          name,
          display_order,
          created_at,
          light: light_id ( id, name, model_number, price ),
          pump: pump_id ( id, name, model_number, price ),
          sanitiser: sanitiser_id ( id, name, model_number, price ),
          filter: filter_id ( id, name, model_number, price ),
          handover_kit: handover_kit_id (
            id,
            name,
            components: handover_kit_package_components (
              quantity,
              component: component_id ( id, name, model_number, price )
            )
          )
        `)
        .order('display_order');

      if (error) throw error;
      return data as unknown as PackageWithComponents[];
    },
  });

  const updateStandardPackageMutation = useMutation({
    mutationFn: async (packageId: string) => {
      console.log('Updating standard package to:', packageId);
      const { data, error } = await supabase
        .from("pool_specifications")
        .update({ standard_filtration_package_id: packageId })
        .eq("id", id)
        .select();
      
      if (error) {
        console.error('Error updating standard package:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specification", id] });
      toast.success("Standard filtration package updated successfully");
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error("Failed to update standard filtration package");
    },
  });

  useEffect(() => {
    if (pool?.standard_filtration_package_id) {
      setSelectedPackageId(pool.standard_filtration_package_id);
    } else if (filtrationPackages?.length && !selectedPackageId) {
      setSelectedPackageId(filtrationPackages[0].id);
    }
  }, [filtrationPackages, selectedPackageId, pool?.standard_filtration_package_id]);

  const { data: digType } = useQuery({
    queryKey: ["excavation-dig-type", pool?.name ? poolDigTypeMap[pool.name] : null],
    queryFn: async () => {
      if (!pool?.name) return null;
      const { data, error } = await supabase
        .from("excavation_dig_types")
        .select("*")
        .eq("name", poolDigTypeMap[pool.name])
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!pool?.name,
  });

  const { data: fixedCosts = [] } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order('display_order');

      if (error) throw error;
      return data;
    },
  });

  if (poolLoading || packagesLoading) {
    return <div>Loading...</div>;
  }

  if (!pool) {
    return <div>Pool not found</div>;
  }

  const selectedPackage = filtrationPackages?.find(pkg => pkg.id === selectedPackageId) || filtrationPackages?.[0];

  // Calculate total fixed costs
  const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + cost.price, 0);

  // Calculate total pool specific costs
  const poolCosts = initialPoolCosts[pool.name] || {
    truckedWater: 0,
    saltBags: 0,
    copingSupply: 0,
    beam: 0,
    copingLay: 0,
    peaGravel: 0,
    installFee: 0
  };

  const excavationCost = digType ? 
    (digType.truck_count * digType.truck_hourly_rate * digType.truck_hours) +
    (digType.excavation_hourly_rate * digType.excavation_hours) : 0;

  const totalPoolCosts = 
    poolCosts.truckedWater +
    poolCosts.saltBags +
    poolCosts.copingSupply +
    poolCosts.beam +
    poolCosts.copingLay +
    poolCosts.peaGravel +
    poolCosts.installFee +
    excavationCost;

  // Calculate filtration package total
  const calculatePackageTotal = (pkg: PackageWithComponents) => {
    const handoverKitTotal = pkg.handover_kit?.components.reduce((total, comp) => {
      return total + ((comp.component?.price || 0) * comp.quantity);
    }, 0) || 0;

    return (
      (pkg.light?.price || 0) +
      (pkg.pump?.price || 0) +
      (pkg.sanitiser?.price || 0) +
      (pkg.filter?.price || 0) +
      handoverKitTotal
    );
  };

  const filtrationTotal = selectedPackage ? calculatePackageTotal(selectedPackage) : 0;

  // Calculate pool shell price
  const poolShellPrice = pool.buy_price_inc_gst || 0;

  // Calculate grand total including all components
  const grandTotal = totalFixedCosts + totalPoolCosts + filtrationTotal + poolShellPrice;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <PoolBreadcrumb poolName={pool.name} />
        <PoolHeader name={pool.name} range={pool.range} />
        <PoolOutline />
        <PoolSpecifications pool={pool} />
        {selectedPackage && filtrationPackages && (
          <FiltrationPackage
            selectedPackageId={selectedPackageId}
            onPackageChange={setSelectedPackageId}
            filtrationPackages={filtrationPackages}
            selectedPackage={selectedPackage}
            onSetStandard={() => updateStandardPackageMutation.mutate(selectedPackageId)}
            isStandard={selectedPackageId === pool.standard_filtration_package_id}
          />
        )}
        <PoolCosts poolName={pool.name} />
        <FixedCosts />
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pool Shell Price:</span>
                <span>{formatCurrency(poolShellPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Filtration Package:</span>
                <span>{formatCurrency(filtrationTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pool Specific Costs:</span>
                <span>{formatCurrency(totalPoolCosts)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fixed Costs:</span>
                <span>{formatCurrency(totalFixedCosts)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-4 border-t">
              <span>True Cost:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolDetails;
