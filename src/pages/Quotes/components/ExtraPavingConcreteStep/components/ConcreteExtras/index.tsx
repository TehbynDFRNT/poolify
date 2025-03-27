
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SquareDashedBottom, Truck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useConcretePump } from "@/pages/ConstructionCosts/hooks/useConcretePump";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { Skeleton } from "@/components/ui/skeleton";

export const ConcreteExtras: React.FC = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const { concretePump, isLoading } = useConcretePump();
  const [isPumpRequired, setIsPumpRequired] = useState(quoteData.concrete_pump_required || false);

  const handleToggle = (checked: boolean) => {
    setIsPumpRequired(checked);
    
    // Update quote data with pump information
    updateQuoteData({
      concrete_pump_required: checked,
      concrete_pump_price: checked && concretePump ? concretePump.price : 0
    });
  };

  return (
    <Card className="border border-gray-200 mt-6">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <SquareDashedBottom className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-medium">Concrete Extras</h3>
        </div>
      </CardHeader>
      
      <CardContent className="p-5">
        <div className="space-y-6">
          {/* Concrete Pump Section */}
          <div className="rounded-md border p-4">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="h-5 w-5 text-gray-500" />
              <h4 className="text-base font-medium">Concrete Pump</h4>
            </div>
            
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
          </div>
          
          {/* You can add more concrete extras here in the future */}
        </div>
      </CardContent>
    </Card>
  );
};
