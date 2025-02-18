
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
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";

const PoolSpecificCosts = () => {
  const { data: pools, isLoading } = useQuery({
    queryKey: ["pools"],
    queryFn: async () => {
      // First get the range order
      const { data: ranges } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      // Then get all pools
      const { data: poolsData, error } = await supabase
        .from("pool_specifications")
        .select("*");

      if (error) throw error;

      // Sort pools based on range order
      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsData || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      }) as Pool[];
    },
  });

  if (isLoading) {
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Range</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Length</TableHead>
                  <TableHead>Width</TableHead>
                  <TableHead>Shallow End</TableHead>
                  <TableHead>Deep End</TableHead>
                  <TableHead>Waterline L/M</TableHead>
                  <TableHead>Water Volume (L)</TableHead>
                  <TableHead>Salt Bags</TableHead>
                  <TableHead>Salt Fixed</TableHead>
                  <TableHead>Weight (KG)</TableHead>
                  <TableHead>Minerals Initial</TableHead>
                  <TableHead>Minerals Topup</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pools?.map((pool) => (
                  <TableRow key={pool.id}>
                    <TableCell>{pool.range}</TableCell>
                    <TableCell>{pool.name}</TableCell>
                    <TableCell>{pool.length}m</TableCell>
                    <TableCell>{pool.width}m</TableCell>
                    <TableCell>{pool.depth_shallow}m</TableCell>
                    <TableCell>{pool.depth_deep}m</TableCell>
                    <TableCell>{pool.waterline_l_m || "-"}</TableCell>
                    <TableCell>{pool.volume_liters || "-"}</TableCell>
                    <TableCell>{pool.salt_volume_bags || "-"}</TableCell>
                    <TableCell>{pool.salt_volume_bags_fixed || "-"}</TableCell>
                    <TableCell>{pool.weight_kg || "-"}</TableCell>
                    <TableCell>{pool.minerals_kg_initial || "-"}</TableCell>
                    <TableCell>{pool.minerals_kg_topup || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolSpecificCosts;
