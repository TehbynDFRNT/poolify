
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import type { Pool } from "@/types/pool";
import AddPoolForm from "@/components/pools/AddPoolForm";
import { PoolTable } from "@/components/pools/PoolTable";
import { PoolRangeManager } from "@/components/pools/PoolRangeManager";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading pool specifications...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-destructive">
            Error loading pool specifications. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
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
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Pool
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && <AddPoolForm />}
          {pools && <PoolTable pools={pools} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default PoolSpecifications;
