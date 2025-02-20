
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PoolIndividualCostsTable } from "@/components/pool-individual-costs/PoolIndividualCostsTable";
import { supabase } from "@/integrations/supabase/client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { PoolRangeManager } from "@/components/pools/PoolRangeManager";

const PoolIndividualCosts = () => {
  const [showForm, setShowForm] = useState(false);

  const { data: costs, isLoading, error } = useQuery({
    queryKey: ["pool-individual-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_individual_costs")
        .select("*")
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    meta: {
      onError: () => {
        toast.error("Failed to load pool individual costs");
      }
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading pool individual costs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-destructive">
            Error loading pool individual costs. Please try again later.
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
            <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link to="/construction-costs" className="transition-colors hover:text-foreground">
              Construction Costs
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Pool Individual Costs</BreadcrumbItem>
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
          <CardTitle>Pool Individual Costs</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Cost
          </Button>
        </CardHeader>
        <CardContent>
          {/* TODO: Add form component here */}
          {costs && <PoolIndividualCostsTable costs={costs} />}
        </CardContent>
      </Card>
    </div>
  );
};

export default PoolIndividualCosts;
