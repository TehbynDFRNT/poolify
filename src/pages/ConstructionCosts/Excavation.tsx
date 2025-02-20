
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Construction } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { DigType } from "@/types/dig-type";

const Excavation = () => {
  const { data: digTypes, isLoading } = useQuery({
    queryKey: ['dig-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dig_types')
        .select('*')
        .order('name') as { data: DigType[] | null; error: any };
      
      if (error) throw error;
      return data ?? [];
    },
  });

  const calculateTruckSubTotal = (type: DigType) => {
    return type.truck_quantity * type.truck_hourly_rate * type.truck_hours;
  };

  const calculateExcavationSubTotal = (type: DigType) => {
    return type.excavation_hourly_rate * type.excavation_hours;
  };

  const calculateGrandTotal = (type: DigType) => {
    return calculateTruckSubTotal(type) + calculateExcavationSubTotal(type);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Breadcrumb className="mb-6">
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
              <Link to="/construction-costs/excavation" className="transition-colors hover:text-foreground">
                Excavation
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Excavation Costs</h1>
            <p className="text-gray-500 mt-1">Manage excavation costs for different dig types</p>
          </div>
          <Construction className="h-6 w-6 text-gray-500" />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dig Type</TableHead>
                <TableHead>Trucks</TableHead>
                <TableHead>Truck Rate</TableHead>
                <TableHead>Truck Hours</TableHead>
                <TableHead>Truck Subtotal</TableHead>
                <TableHead>Excavation Rate</TableHead>
                <TableHead>Excavation Hours</TableHead>
                <TableHead>Excavation Subtotal</TableHead>
                <TableHead>Grand Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
                    Loading dig types...
                  </TableCell>
                </TableRow>
              ) : digTypes?.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.truck_quantity}</TableCell>
                  <TableCell>{formatCurrency(type.truck_hourly_rate)}</TableCell>
                  <TableCell>{type.truck_hours}</TableCell>
                  <TableCell>{formatCurrency(calculateTruckSubTotal(type))}</TableCell>
                  <TableCell>{formatCurrency(type.excavation_hourly_rate)}</TableCell>
                  <TableCell>{type.excavation_hours}</TableCell>
                  <TableCell>{formatCurrency(calculateExcavationSubTotal(type))}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(calculateGrandTotal(type))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Excavation;
