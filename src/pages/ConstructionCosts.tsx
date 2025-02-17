
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DigType } from "@/types/dig-type";

const ConstructionCosts = () => {
  const { data: digTypes, isLoading } = useQuery({
    queryKey: ["dig-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dig_types")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as DigType[];
    },
  });

  const calculateTotalCost = (digType: DigType) => {
    const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
    const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
    return truckCost + excavationCost;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(amount);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Construction Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dig Type</TableHead>
                <TableHead>Truck Count</TableHead>
                <TableHead>Truck Rate</TableHead>
                <TableHead>Truck Hours</TableHead>
                <TableHead>Excavation Rate</TableHead>
                <TableHead>Excavation Hours</TableHead>
                <TableHead>Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {digTypes?.map((digType) => (
                <TableRow key={digType.id}>
                  <TableCell className="font-medium">{digType.name}</TableCell>
                  <TableCell>{digType.truck_count}</TableCell>
                  <TableCell>{formatCurrency(digType.truck_hourly_rate)}</TableCell>
                  <TableCell>{digType.truck_hours}</TableCell>
                  <TableCell>{formatCurrency(digType.excavation_hourly_rate)}</TableCell>
                  <TableCell>{digType.excavation_hours}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(calculateTotalCost(digType))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstructionCosts;
