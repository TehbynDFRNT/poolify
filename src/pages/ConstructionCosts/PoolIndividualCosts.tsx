
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/format";
import { EditableCell } from "@/components/filtration/components/EditableCell";
import { usePoolCosts } from "./hooks/usePoolCosts";
import type { Pool } from "@/types/pool";
import type { ExcavationDigType } from "@/types/excavation-dig-type";

const PoolIndividualCosts = () => {
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

  // Fetch pool costs
  const { data: poolCosts } = useQuery({
    queryKey: ["pool-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*");
      
      if (error) throw error;
      
      // Create a map of pool_id to costs
      const costsMap = new Map();
      data?.forEach(cost => {
        costsMap.set(cost.pool_id, cost);
      });
      
      return costsMap;
    }
  });

  // Fetch excavation data
  const { data: excavationData } = useQuery({
    queryKey: ["pool-excavation-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_excavation_types")
        .select(`
          *,
          dig_type:excavation_dig_types(*)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const { 
    editingId, 
    editingCosts, 
    setEditingId, 
    setEditingCosts, 
    updateCostMutation 
  } = usePoolCosts();

  // Calculate dig cost function
  const calculateDigCost = (digType: ExcavationDigType) => {
    const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
    const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
    return truckCost + excavationCost;
  };

  // Create a map of pool names to their excavation costs
  const excavationCosts = new Map();
  excavationData?.forEach(excavation => {
    if (excavation.dig_type) {
      excavationCosts.set(excavation.name, calculateDigCost(excavation.dig_type));
    }
  });

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Range</TableHead>
                    <TableHead>Pool Name</TableHead>
                    <TableHead>Excavation Cost</TableHead>
                    <TableHead>Pea Gravel/Backfill</TableHead>
                    <TableHead>Install Fee</TableHead>
                    <TableHead>Trucked Water</TableHead>
                    <TableHead>Salt Bags</TableHead>
                    <TableHead>Misc.</TableHead>
                    <TableHead>Coping Supply</TableHead>
                    <TableHead>Beam</TableHead>
                    <TableHead>Coping Lay</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pools?.map((pool) => {
                    const isEditing = editingId === pool.id;
                    const costs = isEditing ? editingCosts : (poolCosts?.get(pool.id) || {});
                    const excavationCost = excavationCosts.get(pool.name) || 0;
                    
                    const total = excavationCost +
                      (costs.pea_gravel || 0) +
                      (costs.install_fee || 0) +
                      (costs.trucked_water || 0) +
                      (costs.salt_bags || 0) +
                      (costs.misc || 0) +
                      (costs.coping_supply || 0) +
                      (costs.beam || 0) +
                      (costs.coping_lay || 0);

                    return (
                      <TableRow key={pool.id}>
                        <TableCell>{pool.range}</TableCell>
                        <TableCell>{pool.name}</TableCell>
                        <TableCell>{formatCurrency(excavationCost)}</TableCell>
                        <TableCell>
                          <EditableCell
                            value={costs.pea_gravel || 0}
                            isEditing={isEditing}
                            onEdit={() => handleEdit(pool.id)}
                            onSave={() => handleSave(pool.id)}
                            onCancel={handleCancel}
                            onChange={(value) => handleCostChange('pea_gravel', value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(pool.id);
                              if (e.key === 'Escape') handleCancel();
                            }}
                            type="number"
                            align="right"
                            format={formatCurrency}
                          />
                        </TableCell>
                        <TableCell>
                          <EditableCell
                            value={costs.install_fee || 0}
                            isEditing={isEditing}
                            onEdit={() => handleEdit(pool.id)}
                            onSave={() => handleSave(pool.id)}
                            onCancel={handleCancel}
                            onChange={(value) => handleCostChange('install_fee', value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(pool.id);
                              if (e.key === 'Escape') handleCancel();
                            }}
                            type="number"
                            align="right"
                            format={formatCurrency}
                          />
                        </TableCell>
                        <TableCell>
                          <EditableCell
                            value={costs.trucked_water || 0}
                            isEditing={isEditing}
                            onEdit={() => handleEdit(pool.id)}
                            onSave={() => handleSave(pool.id)}
                            onCancel={handleCancel}
                            onChange={(value) => handleCostChange('trucked_water', value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(pool.id);
                              if (e.key === 'Escape') handleCancel();
                            }}
                            type="number"
                            align="right"
                            format={formatCurrency}
                          />
                        </TableCell>
                        <TableCell>
                          <EditableCell
                            value={costs.salt_bags || 0}
                            isEditing={isEditing}
                            onEdit={() => handleEdit(pool.id)}
                            onSave={() => handleSave(pool.id)}
                            onCancel={handleCancel}
                            onChange={(value) => handleCostChange('salt_bags', value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(pool.id);
                              if (e.key === 'Escape') handleCancel();
                            }}
                            type="number"
                            align="right"
                            format={formatCurrency}
                          />
                        </TableCell>
                        <TableCell>
                          <EditableCell
                            value={costs.misc || 0}
                            isEditing={isEditing}
                            onEdit={() => handleEdit(pool.id)}
                            onSave={() => handleSave(pool.id)}
                            onCancel={handleCancel}
                            onChange={(value) => handleCostChange('misc', value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(pool.id);
                              if (e.key === 'Escape') handleCancel();
                            }}
                            type="number"
                            align="right"
                            format={formatCurrency}
                          />
                        </TableCell>
                        <TableCell>
                          <EditableCell
                            value={costs.coping_supply || 0}
                            isEditing={isEditing}
                            onEdit={() => handleEdit(pool.id)}
                            onSave={() => handleSave(pool.id)}
                            onCancel={handleCancel}
                            onChange={(value) => handleCostChange('coping_supply', value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(pool.id);
                              if (e.key === 'Escape') handleCancel();
                            }}
                            type="number"
                            align="right"
                            format={formatCurrency}
                          />
                        </TableCell>
                        <TableCell>
                          <EditableCell
                            value={costs.beam || 0}
                            isEditing={isEditing}
                            onEdit={() => handleEdit(pool.id)}
                            onSave={() => handleSave(pool.id)}
                            onCancel={handleCancel}
                            onChange={(value) => handleCostChange('beam', value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(pool.id);
                              if (e.key === 'Escape') handleCancel();
                            }}
                            type="number"
                            align="right"
                            format={formatCurrency}
                          />
                        </TableCell>
                        <TableCell>
                          <EditableCell
                            value={costs.coping_lay || 0}
                            isEditing={isEditing}
                            onEdit={() => handleEdit(pool.id)}
                            onSave={() => handleSave(pool.id)}
                            onCancel={handleCancel}
                            onChange={(value) => handleCostChange('coping_lay', value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(pool.id);
                              if (e.key === 'Escape') handleCancel();
                            }}
                            type="number"
                            align="right"
                            format={formatCurrency}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(total)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolIndividualCosts;
