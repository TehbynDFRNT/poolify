
import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Pool } from "@/types/pool";
import type { PackageWithComponents } from "@/types/filtration";
import { useState, useEffect } from "react";
import { PoolBreadcrumb } from "./components/PoolBreadcrumb";
import { PoolHeader } from "./components/PoolHeader";
import { PoolOutline } from "./components/PoolOutline";
import { PoolSpecifications } from "./components/PoolSpecifications";
import { FiltrationPackage } from "./components/FiltrationPackage";

const PoolDetails = () => {
  const { id } = useParams();
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");

  const { data: pool, isLoading: poolLoading } = useQuery({
    queryKey: ["pool-specification", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Pool;
    },
  });

  const { data: filtrationPackages, isLoading: packagesLoading } = useQuery({
    queryKey: ["filtration-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("filtration_packages")
        .select(`
          *,
          light:light_id(*),
          pump:pump_id(*),
          sanitiser:sanitiser_id(*),
          filter:filter_id(*),
          handover_kit:handover_kit_id(
            id,
            name,
            components:handover_kit_package_components(
              quantity,
              component:component_id(*)
            )
          )
        `)
        .order('display_order');

      if (error) throw error;
      return data as unknown as PackageWithComponents[];
    },
  });

  useEffect(() => {
    if (filtrationPackages?.length && !selectedPackageId) {
      setSelectedPackageId(filtrationPackages[0].id);
    }
  }, [filtrationPackages, selectedPackageId]);

  if (poolLoading || packagesLoading) {
    return <div>Loading...</div>;
  }

  if (!pool) {
    return <div>Pool not found</div>;
  }

  const selectedPackage = filtrationPackages?.find(pkg => pkg.id === selectedPackageId) || filtrationPackages?.[0];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
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
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PoolDetails;
