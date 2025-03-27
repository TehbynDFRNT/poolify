
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { HardHat } from "lucide-react";
import { useExtraConcreting } from "@/pages/ConstructionCosts/hooks/useExtraConcreting";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { formatCurrency } from "@/utils/format";

interface ExtraConcretingProps {
  onChanged?: () => void;
}

export const ExtraConcreting = React.forwardRef<HTMLDivElement, ExtraConcretingProps>(
  ({ onChanged }, ref) => {
    const { extraConcretingItems, isLoading } = useExtraConcreting();
    const { quoteData, updateQuoteData } = useQuoteContext();
    
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedType, setSelectedType] = useState<string>("");
    const [meterage, setMeterage] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);
    
    // Load saved data when component mounts
    useEffect(() => {
      if (quoteData.extra_concreting_type) {
        setIsEnabled(true);
        setSelectedType(quoteData.extra_concreting_type);
      }
      
      if (quoteData.extra_concreting_meterage && quoteData.extra_concreting_meterage > 0) {
        setMeterage(quoteData.extra_concreting_meterage);
      }
      
      if (quoteData.extra_concreting_cost && quoteData.extra_concreting_cost > 0) {
        setTotalCost(quoteData.extra_concreting_cost);
      }
    }, [quoteData]);
    
    // Calculate total cost when type or meterage changes
    useEffect(() => {
      if (!selectedType || meterage <= 0) {
        setTotalCost(0);
        return;
      }
      
      const selectedConcrete = extraConcretingItems?.find(item => item.id === selectedType);
      if (selectedConcrete) {
        const calculatedCost = selectedConcrete.price * meterage;
        setTotalCost(calculatedCost);
        
        // Update quote data with new calculations
        if (isEnabled) {
          updateQuoteData({
            extra_concreting_cost: calculatedCost,
            extra_concreting_margin: selectedConcrete.margin * meterage
          });
          
          if (onChanged) onChanged();
        }
      }
    }, [selectedType, meterage, isEnabled, extraConcretingItems, onChanged, updateQuoteData]);
    
    // Handle toggle changes
    const handleToggleChange = (checked: boolean) => {
      setIsEnabled(checked);
      
      if (checked) {
        // Activate with current selection
        updateQuoteData({
          extra_concreting_type: selectedType,
          extra_concreting_meterage: meterage,
          extra_concreting_cost: totalCost,
          extra_concreting_margin: getSelectedMargin()
        });
      } else {
        // Reset values in quote when disabled
        updateQuoteData({
          extra_concreting_type: "",
          extra_concreting_meterage: 0,
          extra_concreting_cost: 0,
          extra_concreting_margin: 0
        });
      }
      
      if (onChanged) onChanged();
    };
    
    // Handle concrete type selection
    const handleTypeChange = (value: string) => {
      setSelectedType(value);
      updateQuoteData({
        extra_concreting_type: value
      });
      
      if (onChanged) onChanged();
    };
    
    // Handle meterage changes
    const handleMeterageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0;
      setMeterage(value);
      updateQuoteData({
        extra_concreting_meterage: value
      });
      
      if (onChanged) onChanged();
    };
    
    // Get margin for selected item
    const getSelectedMargin = (): number => {
      const selectedConcrete = extraConcretingItems?.find(item => item.id === selectedType);
      return selectedConcrete ? selectedConcrete.margin * meterage : 0;
    };
    
    return (
      <Card className="border border-gray-200" ref={ref}>
        <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <HardHat className="h-5 w-5 text-gray-500" />
            <h3 className="text-xl font-semibold">Extra Concreting</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="extra-concreting-enabled"
              checked={isEnabled}
              onCheckedChange={handleToggleChange}
            />
            <Label htmlFor="extra-concreting-enabled">
              {isEnabled ? "Enabled" : "Disabled"}
            </Label>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : extraConcretingItems && extraConcretingItems.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="concrete-type">Concrete Type</Label>
                  <Select
                    value={selectedType}
                    onValueChange={handleTypeChange}
                    disabled={!isEnabled}
                  >
                    <SelectTrigger id="concrete-type">
                      <SelectValue placeholder="Select concrete type" />
                    </SelectTrigger>
                    <SelectContent>
                      {extraConcretingItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.type} ({formatCurrency(item.price)}/m²)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meterage">Meterage (m²)</Label>
                  <Input
                    id="meterage"
                    type="number"
                    min="0"
                    step="0.01"
                    value={meterage || ""}
                    onChange={handleMeterageChange}
                    disabled={!isEnabled}
                  />
                </div>
              </div>
              {isEnabled && selectedType && meterage > 0 && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-medium">Total Cost:</span>
                    <span className="font-bold">{formatCurrency(totalCost)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Calculation: {formatCurrency(extraConcretingItems.find(item => item.id === selectedType)?.price || 0)} × {meterage} m²
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-md border border-dashed border-gray-300">
              <p className="text-muted-foreground text-center">
                No extra concreting types available.
              </p>
              <p className="text-muted-foreground text-center text-sm mt-2">
                Add them in the Construction Costs section first.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
);

ExtraConcreting.displayName = "ExtraConcreting";
