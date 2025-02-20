
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import type { ExcavationRate, DigType } from "@/types/excavation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface RateFormValues {
  truckRate: number;
  excavationRate: number;
}

const Excavation = () => {
  const form = useForm<RateFormValues>({
    defaultValues: {
      truckRate: 0,
      excavationRate: 0,
    },
  });

  const { data: rates, isLoading: isLoadingRates } = useQuery({
    queryKey: ["excavation-rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excavation_rates")
        .select("*");

      if (error) throw error;
      return data as ExcavationRate[];
    },
    onSuccess: (data) => {
      const truckRate = data.find(rate => rate.category === 'truck')?.hourly_rate || 0;
      const excavationRate = data.find(rate => rate.category === 'excavation')?.hourly_rate || 0;
      form.setValue('truckRate', truckRate);
      form.setValue('excavationRate', excavationRate);
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

  const calculateCosts = (digType: DigType) => {
    const truckRate = form.watch('truckRate');
    const excavationRate = form.watch('excavationRate');
    
    const truckSubtotal = truckRate * digType.truck_hours * digType.truck_quantity;
    const excavationSubtotal = excavationRate * digType.excavation_hours;
    const total = truckSubtotal + excavationSubtotal;

    return {
      truckSubtotal,
      excavationSubtotal,
      total,
    };
  };

  const isLoading = isLoadingRates || isLoadingDigTypes;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Hourly Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="truckRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Truck Hourly Rate</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excavationRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excavation Hourly Rate</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dig Type Costs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading rates...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dig Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Truck Hours</TableHead>
                    <TableHead className="text-right">Truck Quantity</TableHead>
                    <TableHead className="text-right">Excavation Hours</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {digTypes?.map((digType) => {
                    const costs = calculateCosts(digType);
                    return (
                      <TableRow key={digType.id}>
                        <TableCell>{digType.name}</TableCell>
                        <TableCell>{digType.description}</TableCell>
                        <TableCell className="text-right">{digType.truck_hours}</TableCell>
                        <TableCell className="text-right">{digType.truck_quantity}</TableCell>
                        <TableCell className="text-right">{digType.excavation_hours}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(costs.total)}
                        </TableCell>
                      </TableRow>
                    )}
                  )}
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
