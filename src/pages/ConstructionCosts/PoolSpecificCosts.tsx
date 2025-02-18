
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
      const { data, error } = await supabase
        .from("pool_specifications")
        .select("*")
        .order("range", { ascending: true });

      if (error) throw error;
      return data as Pool[];
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
                  <TableHead>Depth (Shallow)</TableHead>
                  <TableHead>Depth (Deep)</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Additional Costs</TableHead>
                  <TableHead>Total Cost</TableHead>
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
                    <TableCell>{formatCurrency(pool.buy_price_ex_gst || 0)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="Enter cost"
                        className="w-32"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      {formatCurrency((pool.buy_price_ex_gst || 0))}
                    </TableCell>
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
