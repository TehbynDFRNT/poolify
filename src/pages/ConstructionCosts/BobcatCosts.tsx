
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Truck } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import type { BobcatCost } from "@/types/bobcat-cost";

const BobcatCosts = () => {
  const { data: costs, isLoading } = useQuery({
    queryKey: ["bobcat-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bobcat_costs")
        .select("*")
        .order("size_category")
        .order("day_code");

      if (error) {
        throw error;
      }

      return data as BobcatCost[];
    },
  });

  // Group costs by size category
  const groupedCosts = costs?.reduce((acc, cost) => {
    if (!acc[cost.size_category]) {
      acc[cost.size_category] = [];
    }
    acc[cost.size_category].push(cost);
    return acc;
  }, {} as Record<string, BobcatCost[]>);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs" className="transition-colors hover:text-foreground">
                Construction Costs
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/bobcat-costs" className="transition-colors hover:text-foreground">
                Bobcat Costs
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Bobcat Costs</h1>
            <p className="text-gray-500 mt-1">View and manage bobcat rental costs by size and duration</p>
          </div>
          <Truck className="h-6 w-6 text-gray-500" />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          {isLoading ? (
            <p className="text-gray-500">Loading costs...</p>
          ) : (
            <div className="space-y-8">
              {groupedCosts && Object.entries(groupedCosts).map(([sizeCategory, costs]) => (
                <div key={sizeCategory}>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">{sizeCategory}</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day Code</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {costs.map((cost) => (
                        <TableRow key={cost.id}>
                          <TableCell>{cost.day_code}</TableCell>
                          <TableCell className="text-right">{formatCurrency(cost.price)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BobcatCosts;
