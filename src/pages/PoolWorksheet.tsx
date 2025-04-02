
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";

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
          <h1 className="text-3xl font-bold">Pool Worksheet</h1>
          <p className="text-muted-foreground mt-1">
            A comprehensive breakdown of all pool specifications
          </p>
        </div>
        
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell 
                  colSpan={15} 
                  className="bg-blue-100 text-blue-800 font-medium py-2 px-4 text-left border-b"
                >
                  Pool Specifications
                </TableCell>
              </TableRow>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Range</TableHead>
                <TableHead>Length</TableHead>
                <TableHead>Width</TableHead>
                <TableHead>Depth (Shallow)</TableHead>
                <TableHead>Depth (Deep)</TableHead>
                <TableHead>Waterline (L/m)</TableHead>
                <TableHead>Volume (L)</TableHead>
                <TableHead>Weight (kg)</TableHead>
                <TableHead>Salt Bags</TableHead>
                <TableHead>Salt Bags (Fixed)</TableHead>
                <TableHead>Initial Minerals (kg)</TableHead>
                <TableHead>Topup Minerals (kg)</TableHead>
                <TableHead>Buy Price (ex GST)</TableHead>
                <TableHead>Buy Price (inc GST)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={15} className="text-center py-4">
                    Loading pool specifications...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={15} className="text-center py-4 text-red-500">
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
                    <TableCell>{pool.waterline_l_m?.toFixed(2) || '-'}L/m</TableCell>
                    <TableCell>{pool.volume_liters?.toLocaleString() || '-'}L</TableCell>
                    <TableCell>{pool.weight_kg?.toLocaleString() || '-'}kg</TableCell>
                    <TableCell>{pool.salt_volume_bags || '-'}</TableCell>
                    <TableCell>{pool.salt_volume_bags_fixed || '-'}</TableCell>
                    <TableCell>{pool.minerals_kg_initial || '-'}</TableCell>
                    <TableCell>{pool.minerals_kg_topup || '-'}</TableCell>
                    <TableCell>{pool.buy_price_ex_gst ? formatCurrency(pool.buy_price_ex_gst) : '-'}</TableCell>
                    <TableCell>{pool.buy_price_inc_gst ? formatCurrency(pool.buy_price_inc_gst) : '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={15} className="text-center py-4">
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
