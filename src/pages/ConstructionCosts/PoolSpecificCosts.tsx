
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

const PoolSpecificCosts = () => {
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

  if (isLoadingPools) {
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
            <div className="text-center py-8 text-gray-500">
              <p>Pool specific costs have been moved to a different section.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolSpecificCosts;
