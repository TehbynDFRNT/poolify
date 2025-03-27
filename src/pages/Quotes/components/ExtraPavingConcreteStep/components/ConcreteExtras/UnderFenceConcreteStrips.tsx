
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Fence } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUnderFenceConcreteStrips } from "@/pages/ConstructionCosts/hooks/useUnderFenceConcreteStrips";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { UnderFenceConcreteStripSelection } from "@/pages/Quotes/components/ExtraPavingStep/types";

interface UnderFenceConcreteStripsProps {
  onChanged?: () => void;
}

export const UnderFenceConcreteStrips: React.FC<UnderFenceConcreteStripsProps> = ({ onChanged }) => {
  const { underFenceConcreteStrips, isLoading: isStripsLoading } = useUnderFenceConcreteStrips();
  const { quoteData, updateQuoteData } = useQuoteContext();
  
  // Under fence concrete strips state
  const [selectedStrips, setSelectedStrips] = React.useState<UnderFenceConcreteStripSelection[]>([]);
  const [stripsCost, setStripsCost] = React.useState(0);

  // Load existing under fence concrete strips data
  useEffect(() => {
    if (quoteData.under_fence_strips_data) {
      try {
        const existingStrips = Array.isArray(quoteData.under_fence_strips_data) 
          ? quoteData.under_fence_strips_data 
          : JSON.parse(quoteData.under_fence_strips_data);
          
        if (Array.isArray(existingStrips)) {
          setSelectedStrips(existingStrips);
          // Calculate total cost from loaded strips
          const total = existingStrips.reduce((sum, strip) => sum + (strip.cost * strip.quantity), 0);
          setStripsCost(total);
        }
      } catch (error) {
        console.error("Error parsing under fence strips data:", error);
      }
    }
  }, [quoteData.under_fence_strips_data]);

  // Under fence concrete strips handlers
  const handleAddStrip = (stripId: string) => {
    const strip = underFenceConcreteStrips?.find(s => s.id === stripId);
    if (!strip) return;
    
    const existingStrip = selectedStrips.find(s => s.id === stripId);
    
    if (existingStrip) {
      // Update quantity if already exists
      const updatedStrips = selectedStrips.map(s => 
        s.id === stripId ? { ...s, quantity: s.quantity + 1 } : s
      );
      setSelectedStrips(updatedStrips);
      saveStripsData(updatedStrips);
    } else {
      // Add new strip with quantity 1
      const newStrip: UnderFenceConcreteStripSelection = {
        id: strip.id,
        type: strip.type,
        cost: strip.cost,
        margin: strip.margin,
        quantity: 1
      };
      const updatedStrips = [...selectedStrips, newStrip];
      setSelectedStrips(updatedStrips);
      saveStripsData(updatedStrips);
    }
  };
  
  const handleUpdateStripQuantity = (stripId: string, quantity: number) => {
    if (quantity <= 0) {
      const updatedStrips = selectedStrips.filter(s => s.id !== stripId);
      setSelectedStrips(updatedStrips);
      saveStripsData(updatedStrips);
    } else {
      const updatedStrips = selectedStrips.map(s => 
        s.id === stripId ? { ...s, quantity } : s
      );
      setSelectedStrips(updatedStrips);
      saveStripsData(updatedStrips);
    }
  };
  
  const handleRemoveStrip = (stripId: string) => {
    const updatedStrips = selectedStrips.filter(s => s.id !== stripId);
    setSelectedStrips(updatedStrips);
    saveStripsData(updatedStrips);
  };
  
  const saveStripsData = (strips: UnderFenceConcreteStripSelection[]) => {
    // Calculate total cost
    const total = strips.reduce((sum, strip) => sum + (strip.cost * strip.quantity), 0);
    setStripsCost(total);
    
    // Update context with stringified array
    updateQuoteData({
      under_fence_strips_data: JSON.stringify(strips),
      under_fence_strips_cost: total
    });
    if (onChanged) onChanged();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Under Fence Concrete Strips</CardTitle>
      </CardHeader>
      <CardContent>
        {isStripsLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="space-y-4">
            {/* Strip selector */}
            <div>
              <Label htmlFor="strip-selector" className="mb-2 block">Add Concrete Strip</Label>
              <Select onValueChange={handleAddStrip}>
                <SelectTrigger id="strip-selector">
                  <SelectValue placeholder="Select a strip type to add" />
                </SelectTrigger>
                <SelectContent>
                  {underFenceConcreteStrips?.map(strip => (
                    <SelectItem key={strip.id} value={strip.id}>
                      {strip.type} - ${strip.cost.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected strips list */}
            {selectedStrips.length > 0 && (
              <div className="border rounded-md">
                <div className="bg-muted p-2 rounded-t-md grid grid-cols-12 gap-2 text-sm font-medium">
                  <div className="col-span-6">Strip Type</div>
                  <div className="col-span-2 text-right">Cost</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                <div className="divide-y">
                  {selectedStrips.map(strip => (
                    <div key={strip.id} className="p-2 grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-6 flex items-center">
                        <button 
                          onClick={() => handleRemoveStrip(strip.id)}
                          className="mr-2 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                        {strip.type}
                      </div>
                      <div className="col-span-2 text-right">
                        ${strip.cost.toFixed(2)}
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="1"
                          className="h-8"
                          value={strip.quantity}
                          onChange={(e) => handleUpdateStripQuantity(strip.id, parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2 text-right font-medium">
                        ${(strip.cost * strip.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-muted p-2 rounded-b-md flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${stripsCost.toFixed(2)}</span>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Add concrete strips required under fences or in other locations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
