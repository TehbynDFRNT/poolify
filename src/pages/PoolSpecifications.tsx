import { DashboardLayout } from "@/components/DashboardLayout";
import AddPoolForm from "@/components/pools/AddPoolForm";
import { PoolRangeManager } from "@/components/pools/PoolRangeManager";
import { PoolTable } from "@/components/pools/PoolTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Pool } from "@/types/pool";
import { useQuery } from "@tanstack/react-query";
import { Plus, Wand2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const PoolSpecifications = () => {
  const [showForm, setShowForm] = useState(false);

  const { data: pools, isLoading, error } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      console.log('Fetching pool ranges...');
      const { data: ranges, error: rangesError } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      if (rangesError) {
        console.error('Error fetching ranges:', rangesError);
        throw rangesError;
      }

      console.log('Fetching pools...');
      const { data: poolsData, error: poolsError } = await supabase
        .from("pool_specifications")
        .select("*");

      if (poolsError) {
        console.error('Error fetching pools:', poolsError);
        throw poolsError;
      }

      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsData || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      }) as Pool[];
    },
    meta: {
      onError: () => {
        toast.error("Failed to load pool specifications");
      }
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Loading pool specifications...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-destructive">
              Error loading pool specifications. Please try again later.
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              Pool Specifications
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>Pool Range Order</CardTitle>
          </CardHeader>
          <CardContent>
            <PoolRangeManager />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pool Specifications</CardTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowForm(!showForm)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Pool
              </Button>
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => window.location.href = "/pool-creation-wizard"}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Wizard
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {showForm && <AddPoolForm />}
            {pools && <PoolTable pools={pools} />}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolSpecifications;
