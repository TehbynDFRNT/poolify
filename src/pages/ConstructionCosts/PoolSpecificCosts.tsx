
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import type { Pool } from "@/types/pool";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { useState, useEffect } from "react";
import { poolDigTypeMap, initialPoolCosts } from "./constants";
import { PoolCostsTable } from "./components/PoolCostsTable";

const PoolSpecificCosts = () => {
  const [selectedDigTypes, setSelectedDigTypes] = useState<Record<string, string>>({});

  const { data: pools, isLoading: isLoadingPools } = useQuery({
    queryKey: ["pools"],
    queryFn: async () => {
      const { data: ranges } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      const { data: poolsData, error } = await supabase
        .from("pool_specifications")
        .select("*");

      if (error) throw error;

      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsData || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      }) as Pool[];
    },
  });

  const { data: digTypes, isLoading: isLoadingDigTypes } = useQuery({
    queryKey: ["digTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excavation_dig_types")
        .select("*");
      
      if (error) throw error;
      return data as ExcavationDigType[];
    },
  });

  useEffect(() => {
    if (pools && digTypes) {
      const initialDigTypes: Record<string, string> = {};
      pools.forEach(pool => {
        const fixedName = pool.name.replace("Westminister", "Westminster");
        const mappedDigType = poolDigTypeMap[fixedName];
        if (mappedDigType) {
          const digType = digTypes.find(dt => dt.name === mappedDigType);
          if (digType) {
            initialDigTypes[pool.id] = digType.id;
          }
        }
      });
      setSelectedDigTypes(initialDigTypes);
    }
  }, [pools, digTypes]);

  const calculateExcavationCost = (digType: ExcavationDigType) => {
    const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
    const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
    return truckCost + excavationCost;
  };

  const getExcavationCost = (poolId: string) => {
    const selectedDigTypeId = selectedDigTypes[poolId];
    if (!selectedDigTypeId || !digTypes) return null;
    
    const digType = digTypes.find(dt => dt.id === selectedDigTypeId);
    if (!digType) return null;

    return calculateExcavationCost(digType);
  };

  if (isLoadingPools || isLoadingDigTypes) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/construction-costs">Construction Costs</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Pool Specific Costs</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Pool Specific Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <PoolCostsTable
                pools={pools || []}
                digTypes={digTypes || []}
                selectedDigTypes={selectedDigTypes}
                onDigTypeChange={(poolId, value) => {
                  setSelectedDigTypes(prev => ({
                    ...prev,
                    [poolId]: value
                  }));
                }}
                getExcavationCost={getExcavationCost}
                initialPoolCosts={initialPoolCosts}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolSpecificCosts;
