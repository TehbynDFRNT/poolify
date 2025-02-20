
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import type { ExcavationRate } from "@/types/excavation";

const Excavation = () => {
  const { data: rates, isLoading } = useQuery({
    queryKey: ["excavation-rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excavation_rates")
        .select("*");

      if (error) throw error;
      return data as ExcavationRate[];
    },
  });

  const truckRate = rates?.find(rate => rate.category === 'truck')?.hourly_rate || 0;
  const excavationRate = rates?.find(rate => rate.category === 'excavation')?.hourly_rate || 0;

  // Example values for demonstration
  const truckHours = 8;
  const truckQuantity = 2;
  const excavationHours = 8;

  const truckSubtotal = truckRate * truckHours * truckQuantity;
  const excavationSubtotal = excavationRate * excavationHours;
  const total = truckSubtotal + excavationSubtotal;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Excavation Cost Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading rates...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Hours</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Trucks</TableCell>
                    <TableCell className="text-right">{formatCurrency(truckRate)}/hr</TableCell>
                    <TableCell className="text-right">{truckHours}</TableCell>
                    <TableCell className="text-right">{truckQuantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(truckSubtotal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Excavation</TableCell>
                    <TableCell className="text-right">{formatCurrency(excavationRate)}/hr</TableCell>
                    <TableCell className="text-right">{excavationHours}</TableCell>
                    <TableCell className="text-right">1</TableCell>
                    <TableCell className="text-right">{formatCurrency(excavationSubtotal)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} className="font-medium">Total</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(total)}</TableCell>
                  </TableRow>
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
