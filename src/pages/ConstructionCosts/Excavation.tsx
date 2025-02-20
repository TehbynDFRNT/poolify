
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import type { ExcavationRate, DigType } from "@/types/excavation";
import { useState } from "react";

const Excavation = () => {
  const [selectedDigTypeId, setSelectedDigTypeId] = useState<string | null>(null);

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

  const truckRate = rates?.find(rate => rate.category === 'truck')?.hourly_rate || 0;
  const excavationRate = rates?.find(rate => rate.category === 'excavation')?.hourly_rate || 0;

  const selectedDigType = digTypes?.find(type => type.id === selectedDigTypeId);
  
  const truckHours = selectedDigType?.truck_hours || 0;
  const truckQuantity = selectedDigType?.truck_quantity || 0;
  const excavationHours = selectedDigType?.excavation_hours || 0;

  const truckSubtotal = truckRate * truckHours * truckQuantity;
  const excavationSubtotal = excavationRate * excavationHours;
  const total = truckSubtotal + excavationSubtotal;

  const isLoading = isLoadingRates || isLoadingDigTypes;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Excavation Cost Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Select Dig Type
              </label>
              <Select
                value={selectedDigTypeId || ""}
                onValueChange={(value) => setSelectedDigTypeId(value)}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a dig type" />
                </SelectTrigger>
                <SelectContent>
                  {digTypes?.map((digType) => (
                    <SelectItem key={digType.id} value={digType.id}>
                      {digType.name} - {digType.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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
