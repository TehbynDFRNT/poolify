
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
import { useFormContext } from "react-hook-form";

const CraneStep: React.FC = () => {
  const { craneCosts, selectedCraneId, setSelectedCraneId } = usePoolWizard();
  const { watch } = useFormContext();
  
  const poolName = watch("name");
  const weight = watch("weight_kg");
  
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Select the appropriate crane for <span className="font-medium text-foreground">{poolName}</span>
        {weight && <span> (Weight: {weight} kg)</span>}
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Crane Selection</CardTitle>
          <CardDescription>
            Choose the appropriate crane based on pool weight and installation requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {craneCosts?.length === 0 ? (
            <p className="text-muted-foreground">No crane options available. Please add crane costs first.</p>
          ) : (
            <RadioGroup value={selectedCraneId || ""} onValueChange={setSelectedCraneId}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Crane Type</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {craneCosts?.map((crane) => (
                    <TableRow key={crane.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <RadioGroupItem value={crane.id} id={crane.id} className="mt-0" />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Label htmlFor={crane.id} className="cursor-pointer">
                          {crane.name}
                          {crane.name.includes("Franna") && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Recommended</span>
                          )}
                        </Label>
                      </TableCell>
                      <TableCell className="text-right">
                        <Label htmlFor={crane.id} className="cursor-pointer">
                          {formatCurrency(crane.price)}
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

export default CraneStep;
