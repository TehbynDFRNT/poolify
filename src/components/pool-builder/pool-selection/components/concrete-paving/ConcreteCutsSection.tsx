
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Scissors, Plus, Trash } from "lucide-react";

export const ConcreteCutsSection: React.FC = () => {
  return (
    <Card className="border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Scissors className="h-5 w-5 text-primary" />
          Concrete Cuts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Available Concrete Cuts</Label>
            <Button size="sm" variant="outline" className="flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Cut
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cut Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Standard Cut</TableCell>
                <TableCell>$25.00</TableCell>
                <TableCell>
                  <Input type="number" value="0" className="w-20" min="0" />
                </TableCell>
                <TableCell>$0.00</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Deep Cut</TableCell>
                <TableCell>$35.00</TableCell>
                <TableCell>
                  <Input type="number" value="0" className="w-20" min="0" />
                </TableCell>
                <TableCell>$0.00</TableCell>
                <TableCell>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium">Cost Calculation</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <p className="text-sm">Total cuts:</p>
              <p className="text-sm font-medium text-right">0</p>
              <div className="col-span-2 border-t my-2"></div>
              <p className="text-sm font-medium">Total cost:</p>
              <p className="text-sm font-medium text-right">$0.00</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
