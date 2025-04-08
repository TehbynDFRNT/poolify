
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers } from "lucide-react";

export const ExtraPavingSection: React.FC = () => {
  return (
    <Card className="border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Extra Paving Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="paving-type">Paving Type</Label>
            <Select>
              <SelectTrigger id="paving-type">
                <SelectValue placeholder="Select paving type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Paving</SelectItem>
                <SelectItem value="premium">Premium Paving</SelectItem>
                <SelectItem value="custom">Custom Paving</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="meterage">Meterage</Label>
            <Input id="meterage" type="number" placeholder="0" min="0" />
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-medium">Cost Calculation</h3>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <p className="text-sm">Cost per meter:</p>
            <p className="text-sm font-medium text-right">$0.00</p>
            <p className="text-sm">Total meterage:</p>
            <p className="text-sm font-medium text-right">0 m²</p>
            <div className="col-span-2 border-t my-2"></div>
            <p className="text-sm font-medium">Total cost:</p>
            <p className="text-sm font-medium text-right">$0.00</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
