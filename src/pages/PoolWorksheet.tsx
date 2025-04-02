
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const PoolWorksheet = () => {
  const { data: pools, isLoading, error } = usePoolSpecifications();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              Pool Worksheet
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Pool Specifications</h1>
          <p className="text-muted-foreground mt-1">
            A comprehensive breakdown of all pool specifications
          </p>
        </div>
        
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>name</TableHead>
                <TableHead>range</TableHead>
                <TableHead>length</TableHead>
                <TableHead>width</TableHead>
                <TableHead>depth_shallow</TableHead>
                <TableHead>depth_deep</TableHead>
                <TableHead>waterline_l_m</TableHead>
                <TableHead>volume_liters</TableHead>
                <TableHead>salt_volume_bags</TableHead>
                <TableHead>salt_volume_bags_fixed</TableHead>
                <TableHead>weight_kg</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4">
                    Loading pool specifications...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4 text-red-500">
                    Error loading pool specifications
                  </TableCell>
                </TableRow>
              ) : pools && pools.length > 0 ? (
                pools.map((pool) => (
                  <TableRow key={pool.id}>
                    <TableCell>{pool.name}</TableCell>
                    <TableCell>{pool.range}</TableCell>
                    <TableCell>{pool.length.toFixed(2)}m</TableCell>
                    <TableCell>{pool.width.toFixed(2)}m</TableCell>
                    <TableCell>{pool.depth_shallow.toFixed(2)}m</TableCell>
                    <TableCell>{pool.depth_deep.toFixed(2)}m</TableCell>
                    <TableCell>{pool.waterline_l_m?.toFixed(2)}L/m</TableCell>
                    <TableCell>{pool.volume_liters?.toLocaleString()}L</TableCell>
                    <TableCell>{pool.salt_volume_bags || '-'}</TableCell>
                    <TableCell>{pool.salt_volume_bags_fixed || '-'}</TableCell>
                    <TableCell>{pool.weight_kg ? pool.weight_kg.toLocaleString() : '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-4">
                    No pool specifications available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PoolWorksheet;
