
import React from "react";
import { usePoolWizard } from "@/contexts/PoolWizardContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/format";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";
import { useFormContext } from "react-hook-form";

const ExcavationStep: React.FC = () => {
  const { digTypes, selectedDigTypeId, setSelectedDigTypeId } = usePoolWizard();
  const { watch } = useFormContext();
  
  const poolName = watch("name");
  
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Select the appropriate excavation type for <span className="font-medium text-foreground">{poolName}</span>
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Excavation Types</CardTitle>
          <CardDescription>
            Choose the excavation method based on site conditions and pool requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {digTypes?.length === 0 ? (
            <p className="text-muted-foreground">No dig types available. Please create dig types first.</p>
          ) : (
            <RadioGroup value={selectedDigTypeId || ""} onValueChange={setSelectedDigTypeId}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Dig Type</TableHead>
                    <TableHead>Excavation Hours</TableHead>
                    <TableHead>Truck Hours</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {digTypes?.map((digType) => (
                    <TableRow key={digType.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <RadioGroupItem value={digType.id} id={digType.id} className="mt-0" />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Label htmlFor={digType.id} className="cursor-pointer">
                          {digType.name}
                        </Label>
                      </TableCell>
                      <TableCell>
                        <Label htmlFor={digType.id} className="cursor-pointer">
                          {digType.excavation_hours} hrs @ {formatCurrency(digType.excavation_hourly_rate)}/hr
                        </Label>
                      </TableCell>
                      <TableCell>
                        <Label htmlFor={digType.id} className="cursor-pointer">
                          {digType.truck_quantity} x {digType.truck_hours} hrs @ {formatCurrency(digType.truck_hourly_rate)}/hr
                        </Label>
                      </TableCell>
                      <TableCell className="text-right">
                        <Label htmlFor={digType.id} className="cursor-pointer">
                          {formatCurrency(calculateGrandTotal(digType))}
                        </Label>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </RadioGroup>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExcavationStep;
