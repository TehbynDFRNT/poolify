import { DashboardLayout } from "@/components/DashboardLayout";
import { Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";
import { calculatePackagePrice } from "@/utils/package-calculations";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X } from "lucide-react";

const PriceBuilder = () => {
  const navigate = useNavigate();
  const [margins, setMargins] = useState<Record<string, number>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempMargin, setTempMargin] = useState<string>("");

  // Fetch pools with ranges for sorting
  const { data: pools, isLoading: isLoadingPools } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      const { data: ranges } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      const { data: poolsData, error } = await supabase
        .from("pool_specifications")
        .select(`
          *,
          default_filtration_package:filtration_packages!pool_specifications_default_filtration_package_id_fkey (
            id,
            name,
            light:filtration_components!filtration_packages_light_id_fkey (id, name, model_number, price),
            pump:filtration_components!filtration_packages_pump_id_fkey (id, name, model_number, price),
            sanitiser:filtration_components!filtration_packages_sanitiser_id_fkey (id, name, model_number, price),
            filter:filtration_components!filtration_packages_filter_id_fkey (id, name, model_number, price),
            handover_kit:handover_kit_packages (
              id,
              name,
              components:handover_kit_package_components (
                quantity,
                component:filtration_components (id, name, model_number, price)
              )
            )
          )
        `);

      if (error) throw error;

      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsData || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      });
    },
  });

  // Fetch fixed costs
  const { data: fixedCosts, isLoading: isLoadingFixed } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data;
    },
  });

  // Fetch pool costs
  const { data: poolCosts, isLoading: isLoadingCosts } = useQuery({
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

  // Fetch excavation details
  const { data: excavationDetails, isLoading: isLoadingExcavation } = useQuery({
    queryKey: ["pool-excavation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          pool_id,
          dig_type:dig_types (*)
        `);

      if (error) throw error;

      const excavationMap = new Map();
      data?.forEach(match => {
        excavationMap.set(match.pool_id, match.dig_type);
      });

      return excavationMap;
    },
  });

  const isLoading = isLoadingPools || isLoadingFixed || isLoadingCosts || isLoadingExcavation;

  const calculateCosts = (pool: any) => {
    const basePrice = pool.buy_price_inc_gst || 0;
    const filtrationCost = pool.default_filtration_package ? calculatePackagePrice(pool.default_filtration_package) : 0;
    const fixedCostsTotal = fixedCosts?.reduce((sum, cost) => sum + cost.price, 0) || 0;
    
    const individualCosts = poolCosts?.get(pool.id);
    const individualCostsTotal = individualCosts ? Object.entries(individualCosts).reduce((sum, [key, value]) => {
      if (key !== 'id' && typeof value === 'number') {
        return sum + value;
      }
      return sum;
    }, 0) : 0;
    
    const excavationCost = excavationDetails?.get(pool.id) ? calculateGrandTotal(excavationDetails.get(pool.id)) : 0;
    
    const totalCost = basePrice + filtrationCost + fixedCostsTotal + individualCostsTotal + excavationCost;
    const marginPercentage = margins[pool.id] || 0;
    
    // Convert margin to RRP
    // If we want a margin of M%, then:
    // M = (RRP - Cost) / RRP * 100
    // Solving for RRP:
    // M/100 = (RRP - Cost) / RRP
    // M*RRP/100 = RRP - Cost
    // RRP - M*RRP/100 = Cost
    // RRP*(1 - M/100) = Cost
    // RRP = Cost / (1 - M/100)
    const rrp = marginPercentage >= 100 ? 0 : totalCost / (1 - marginPercentage / 100);

    return {
      basePrice,
      filtrationCost,
      fixedCostsTotal,
      individualCostsTotal,
      excavationCost,
      total: totalCost,
      rrp
    };
  };

  const handleStartEdit = (poolId: string) => {
    setEditingId(poolId);
    setTempMargin(margins[poolId]?.toString() || "");
  };

  const handleSave = (poolId: string) => {
    const numValue = parseFloat(tempMargin) || 0;
    const clampedValue = Math.min(numValue, 99.9);
    setMargins(prev => ({
      ...prev,
      [poolId]: clampedValue
    }));
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempMargin("");
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Price Builder</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>Price Builder</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Range</TableHead>
                      <TableHead>Pool Name</TableHead>
                      <TableHead className="text-right">Base Price</TableHead>
                      <TableHead className="text-right">Filtration</TableHead>
                      <TableHead className="text-right">Fixed Costs</TableHead>
                      <TableHead className="text-right">Individual Costs</TableHead>
                      <TableHead className="text-right">Excavation</TableHead>
                      <TableHead className="text-right">True Cost</TableHead>
                      <TableHead className="text-right">Margin %</TableHead>
                      <TableHead className="text-right">RRP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pools?.map((pool) => {
                      const costs = calculateCosts(pool);
                      return (
                        <TableRow 
                          key={pool.id}
                          className={cn(
                            "cursor-pointer hover:bg-muted/50",
                            "transition-colors"
                          )}
                          onClick={(e) => {
                            // Don't navigate if clicking on the margin cell
                            if ((e.target as HTMLElement).closest('.margin-cell')) {
                              e.stopPropagation();
                              return;
                            }
                            navigate(`/price-builder/${pool.id}`);
                          }}
                        >
                          <TableCell className="font-medium">{pool.range}</TableCell>
                          <TableCell>{pool.name}</TableCell>
                          <TableCell className="text-right">{formatCurrency(costs.basePrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(costs.filtrationCost)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(costs.fixedCostsTotal)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(costs.individualCostsTotal)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(costs.excavationCost)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(costs.total)}</TableCell>
                          <TableCell className="margin-cell" onClick={e => e.stopPropagation()}>
                            {editingId === pool.id ? (
                              <div className="flex items-center gap-2 justify-end">
                                <Input
                                  type="number"
                                  value={tempMargin}
                                  onChange={(e) => setTempMargin(e.target.value)}
                                  className="w-24 text-right"
                                  min={0}
                                  max={99.9}
                                  step={0.1}
                                />
                                <Button size="sm" variant="ghost" onClick={() => handleSave(pool.id)}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={handleCancel}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div
                                className="cursor-pointer hover:bg-muted px-2 py-1 rounded flex items-center justify-end gap-2 group"
                                onClick={() => handleStartEdit(pool.id)}
                              >
                                {margins[pool.id]?.toFixed(1) || '0.0'}%
                                <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-medium text-primary">
                            {formatCurrency(costs.rrp)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PriceBuilder;
