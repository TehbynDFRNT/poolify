
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shovel } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ExtraConcretingSection: React.FC = () => {
  return (
    <Card className="border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shovel className="h-5 w-5 text-primary" />
          Extra Concreting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="concrete-type">Concrete Type</Label>
            <Select>
              <SelectTrigger id="concrete-type">
                <SelectValue placeholder="Select concrete type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Concrete</SelectItem>
                <SelectItem value="colored">Colored Concrete</SelectItem>
                <SelectItem value="exposed">Exposed Aggregate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="concrete-meterage">Meterage</Label>
            <Input id="concrete-meterage" type="number" placeholder="0" min="0" />
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <Label>Additional Costs</Label>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Material Cost</TableCell>
                <TableCell>Base concrete cost</TableCell>
                <TableCell>$0.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Labor</TableCell>
                <TableCell>Concrete pouring and finishing</TableCell>
                <TableCell>$0.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
                <TableCell className="font-medium">$0.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
