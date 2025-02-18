
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Range</TableHead>
                    <TableHead className="whitespace-nowrap">Name</TableHead>
                    <TableHead className="whitespace-nowrap">Length</TableHead>
                    <TableHead className="whitespace-nowrap">Width</TableHead>
                    <TableHead className="whitespace-nowrap">Shallow End</TableHead>
                    <TableHead className="whitespace-nowrap">Deep End</TableHead>
                    <TableHead className="whitespace-nowrap">Pea Gravel/Backfill</TableHead>
                    <TableHead className="whitespace-nowrap">Install Fee</TableHead>
                    <TableHead className="whitespace-nowrap">Trucked Water</TableHead>
                    <TableHead className="whitespace-nowrap">Salt Bags</TableHead>
                    <TableHead className="whitespace-nowrap">Coping Supply</TableHead>
                    <TableHead className="whitespace-nowrap">Coping Lay</TableHead>
                    <TableHead className="whitespace-nowrap">Beam</TableHead>
                    <TableHead className="whitespace-nowrap">Excavation</TableHead>
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
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          className="w-32"
                          placeholder="Enter cost"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolSpecificCosts;
