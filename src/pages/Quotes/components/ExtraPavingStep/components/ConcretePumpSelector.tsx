
import { useState, useEffect } from "react";
import { useConcretePump } from "@/pages/ConstructionCosts/hooks/useConcretePump";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ConcretePumpSelectorProps {
  isPumpRequired: boolean;
  onTogglePump: (isRequired: boolean) => void;
}

export const ConcretePumpSelector = ({ 
  isPumpRequired, 
  onTogglePump 
}: ConcretePumpSelectorProps) => {
  const { concretePump, isLoading } = useConcretePump();
  
  const handleToggle = (checked: boolean) => {
    onTogglePump(checked);
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-lg font-medium">Concrete Pump</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pump-required" className="text-base font-medium">
                  Concrete Pump Required
                </Label>
                <p className="text-sm text-muted-foreground">
                  Add a concrete pump to this installation
                </p>
              </div>
              <Switch 
                id="pump-required" 
                checked={isPumpRequired}
                onCheckedChange={handleToggle} 
              />
            </div>
            
            {isPumpRequired && concretePump && (
              <div className="p-4 bg-muted/50 rounded-md">
                <div className="flex justify-between">
                  <span className="font-medium">Concrete Pump Cost:</span>
                  <span className="font-bold">${concretePump.price.toFixed(2)}</span>
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              A concrete pump may be required for installations where concrete needs to be delivered 
              to areas not accessible by concrete trucks.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
