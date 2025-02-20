
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import type { ExcavationRate, DigType } from "@/types/excavation";

const Excavation = () => {
  const { data: rates, isLoading: isLoadingRates } = useQuery({
    queryKey: ["excavation-rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excavation_rates")
        .select("*");

      if (error) throw error;
      return data as ExcavationRate[];
    },
  });

  const { data: digTypes, isLoading: isLoadingDigTypes } = useQuery({
    queryKey: ["dig-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dig_types")
        .select("*");

      if (error) throw error;
      return data as DigType[];
    },
  });

  const truckRate = rates?.find(rate => rate.category === 'truck')?.hourly_rate || 115;
  const excavationRate = rates?.find(rate => rate.category === 'excavation')?.hourly_rate || 150;

  const calculateCosts = (digType: DigType) => {
    const truckSubtotal = truckRate * digType.truck_hours * digType.truck_quantity;
    const excavationSubtotal = excavationRate * digType.excavation_hours;
    return {
      truckSubtotal,
      excavationSubtotal,
      total: truckSubtotal + excavationSubtotal
    };
  };

  const isLoading = isLoadingRates || isLoadingDigTypes;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            {isLoading ? (
              <p>Loading rates...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b-2 border-black">
                    <TableHead className="border-r border-black">Dig Type</TableHead>
                    <TableHead colSpan={4} className="text-center border-r border-black">Trucks</TableHead>
                    <TableHead colSpan={3} className="text-center border-r border-black">Excavation</TableHead>
                    <TableHead className="text-right">Grand Total</TableHead>
                  </TableRow>
                  <TableRow>
                    <TableHead className="border-r border-black"></TableHead>
                    <TableHead className="text-center border-r border-black"># of Trucks</TableHead>
                    <TableHead className="text-center border-r border-black">Hourly Rate</TableHead>
                    <TableHead className="text-center border-r border-black">Hours</TableHead>
                    <TableHead className="text-center border-r border-black">Sub Total</TableHead>
                    <TableHead className="text-center border-r border-black">Hourly Rate</TableHead>
                    <TableHead className="text-center border-r border-black">Hours</TableHead>
                    <TableHead className="text-center border-r border-black">Sub Total</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {digTypes?.map((digType) => {
                    const costs = calculateCosts(digType);
                    return (
                      <TableRow key={digType.id} className="border-b border-black">
                        <TableCell className="border-r border-black font-medium">{digType.name}</TableCell>
                        <TableCell className="text-center border-r border-black bg-green-50">{digType.truck_quantity}</TableCell>
                        <TableCell className="text-center border-r border-black">{formatCurrency(truckRate)}</TableCell>
                        <TableCell className="text-center border-r border-black">{digType.truck_hours}</TableCell>
                        <TableCell className="text-right border-r border-black bg-gray-100">{formatCurrency(costs.truckSubtotal)}</TableCell>
                        <TableCell className="text-center border-r border-black">{formatCurrency(excavationRate)}</TableCell>
                        <TableCell className="text-center border-r border-black">{digType.excavation_hours}</TableCell>
                        <TableCell className="text-right border-r border-black">{formatCurrency(costs.excavationSubtotal)}</TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(costs.total)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Excavation;
