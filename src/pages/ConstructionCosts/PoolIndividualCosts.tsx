
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { usePoolCosts } from "./hooks/usePoolCosts";
import { usePoolSpecifications } from "./hooks/usePoolSpecifications";
import { PoolCostsTable } from "./components/PoolCostsTable";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";

const PoolIndividualCosts = () => {
  const { data: pools, isLoading, error } = usePoolSpecifications();

  // Fetch pool costs
  const { data: poolCosts } = useQuery({
    queryKey: ["pool-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*");
      
      if (error) throw error;
      
      const costsMap = new Map();
      data?.forEach(cost => {
        costsMap.set(cost.pool_id, cost);
      });
      
      return costsMap;
    }
  });

  const { 
    editingId, 
    editingCosts, 
    setEditingId, 
    setEditingCosts, 
    updateCostMutation 
  } = usePoolCosts();

  const handleEdit = (poolId: string) => {
    setEditingId(poolId);
    const currentCosts = poolCosts?.get(poolId) || {};
    setEditingCosts(currentCosts);
  };

  const handleSave = async (poolId: string) => {
    await updateCostMutation.mutateAsync({
      poolId,
      updates: editingCosts
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingCosts({});
  };

  const handleCostChange = (field: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      setEditingCosts(prev => ({
        ...prev,
        [field]: numValue
      }));
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

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
              <Link to="/construction-costs" className="transition-colors hover:text-foreground">
                Construction Costs
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              Pool Individual Costs
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>Pool Individual Costs</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="rounded-md border min-w-[1200px]">
              <PoolCostsTable
                pools={pools || []}
                poolCosts={poolCosts || new Map()}
                editingId={editingId}
                editingCosts={editingCosts}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onCostChange={handleCostChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolIndividualCosts;
