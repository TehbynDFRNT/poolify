
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Truck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useConcretePump } from "@/pages/ConstructionCosts/hooks/useConcretePump";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

interface ConcretePumpProps {
  onChanged?: () => void;
}

export const ConcretePump: React.FC<ConcretePumpProps> = ({ onChanged }) => {
  const { concretePump, isLoading: isPumpLoading } = useConcretePump();
  const { quoteData, updateQuoteData } = useQuoteContext();
  
  // Concrete pump state
  const [isPumpRequired, setIsPumpRequired] = React.useState(quoteData.concrete_pump_required || false);
  const [pumpPrice, setPumpPrice] = React.useState(quoteData.concrete_pump_price || (concretePump?.price || 0));

  // Load existing concrete pump data
  useEffect(() => {
    if (quoteData.concrete_pump_required !== undefined) {
      setIsPumpRequired(quoteData.concrete_pump_required);
    }
    if (quoteData.concrete_pump_price !== undefined && quoteData.concrete_pump_price > 0) {
      setPumpPrice(quoteData.concrete_pump_price);
    } else if (concretePump?.price) {
      setPumpPrice(concretePump.price);
    }
  }, [quoteData.concrete_pump_required, quoteData.concrete_pump_price, concretePump]);

  // Save concrete pump data
  const handlePumpToggle = (value: boolean) => {
    setIsPumpRequired(value);
    updateQuoteData({
      concrete_pump_required: value,
      concrete_pump_price: value ? pumpPrice : 0
    });
    if (onChanged) onChanged();
  };

  const handlePumpPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(e.target.value) || 0;
    setPumpPrice(newPrice);
    if (isPumpRequired) {
      updateQuoteData({
        concrete_pump_price: newPrice
      });
      if (onChanged) onChanged();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Concrete Pump</CardTitle>
      </CardHeader>
      <CardContent>
        {isPumpLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pump-required"
                  checked={isPumpRequired}
                  onCheckedChange={handlePumpToggle}
                />
                <Label htmlFor="pump-required">Concrete pump required</Label>
              </div>
              <div className="w-32">
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pumpPrice}
                  onChange={handlePumpPriceChange}
                  disabled={!isPumpRequired}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Required when concrete must be poured at a distance from the truck access point.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
