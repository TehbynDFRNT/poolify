
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import { Calculator, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import type { Pool } from "@/types/pool";
import { initialPoolCosts, poolDigTypeMap } from "@/pages/ConstructionCosts/constants";
import type { PackageWithComponents } from "@/types/filtration";

type PoolWithPackage = Omit<Pool, 'standard_filtration_package_id'> & {
  standard_filtration_package: PackageWithComponents | null;
};

const PricingWorksheet = () => {
  const navigate = useNavigate();

  const { data: pools } = useQuery({
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
        `);

      if (error) throw error;

      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsData || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      }) as PoolWithPackage[];
    },
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

  const { data: digTypes = [] } = useQuery({
    queryKey: ["excavation-dig-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excavation_dig_types")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const calculateTrueCost = (pool: PoolWithPackage) => {
    // Calculate total fixed costs
    const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + cost.price, 0);

    // Calculate pool specific costs
    const poolCosts = initialPoolCosts[pool.name] || {
      truckedWater: 0,
      saltBags: 0,
      copingSupply: 0,
      beam: 0,
      copingLay: 0,
      peaGravel: 0,
      installFee: 0
    };

    const digType = digTypes.find(dt => dt.name === poolDigTypeMap[pool.name]);
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

    const filtrationTotal = pool.standard_filtration_package ? 
      calculatePackageTotal(pool.standard_filtration_package) : 0;

    // Calculate pool shell price
    const poolShellPrice = pool.buy_price_inc_gst || 0;

    // Calculate true cost
    return totalFixedCosts + totalPoolCosts + filtrationTotal + poolShellPrice;
  };

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
                <Link to="/pricing-models">Pricing Models</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/pricing-models/pools">Pools</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Worksheet</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">Pricing Worksheet</h1>
            <p className="text-gray-500 mt-1">Pool pricing overview</p>
          </div>
          <Calculator className="h-6 w-6 text-gray-500" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pool Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Range</TableHead>
                  <TableHead>Pool Name</TableHead>
                  <TableHead className="text-right">True Cost</TableHead>
                  <TableHead className="text-right">Web Price</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pools?.map((pool) => {
                  const trueCost = calculateTrueCost(pool);
                  return (
                    <TableRow key={pool.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/pricing-models/pools/${pool.id}`)}>
                      <TableCell>{pool.range}</TableCell>
                      <TableCell>{pool.name}</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(trueCost)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(0)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(0)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PricingWorksheet;
