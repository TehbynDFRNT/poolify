
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Info } from "lucide-react";
import { useConcretePump } from "@/pages/ConstructionCosts/hooks/useConcretePump";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { useConcreteCuts } from "@/pages/ConstructionCosts/hooks/useConcreteCuts";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUnderFenceConcreteStrips } from "@/pages/ConstructionCosts/hooks/useUnderFenceConcreteStrips";
import { UnderFenceConcreteStripSelection } from "@/pages/Quotes/components/ExtraPavingStep/types";

export const ConcreteExtras = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const { concretePump, isLoading: isPumpLoading } = useConcretePump();
  const { concreteCuts, isLoading: isCutsLoading } = useConcreteCuts();
  const { underFenceConcreteStrips, isLoading: isStripsLoading } = useUnderFenceConcreteStrips();
  
  // Concrete pump state
  const [isPumpRequired, setIsPumpRequired] = useState(quoteData.concrete_pump_required || false);
  const [pumpPrice, setPumpPrice] = useState(quoteData.concrete_pump_price || (concretePump?.price || 0));
  
  // Concrete cuts state
  const [selectedCuts, setSelectedCuts] = useState<any[]>([]);
  const [cutsCost, setCutsCost] = useState(0);
  
  // Under fence concrete strips state
  const [selectedStrips, setSelectedStrips] = useState<UnderFenceConcreteStripSelection[]>([]);
  const [stripsCost, setStripsCost] = useState(0);

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

  // Load existing concrete cuts data
  useEffect(() => {
    if (quoteData.concrete_cuts) {
      try {
        const existingCuts = JSON.parse(quoteData.concrete_cuts);
        if (Array.isArray(existingCuts)) {
          setSelectedCuts(existingCuts);
          // Calculate total cost from loaded cuts
          const total = existingCuts.reduce((sum, cut) => sum + (cut.price * cut.quantity), 0);
          setCutsCost(total);
        }
      } catch (error) {
        console.error("Error parsing concrete cuts:", error);
      }
    }
  }, [quoteData.concrete_cuts]);
  
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

  // Save concrete pump data
  const handlePumpToggle = (value: boolean) => {
    setIsPumpRequired(value);
    updateQuoteData({
      concrete_pump_required: value,
      concrete_pump_price: value ? pumpPrice : 0
    });
  };

  const handlePumpPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = parseFloat(e.target.value) || 0;
    setPumpPrice(newPrice);
    if (isPumpRequired) {
      updateQuoteData({
        concrete_pump_price: newPrice
      });
    }
  };

  // Concrete cuts handlers
  const handleAddCut = (cutId: string) => {
    const cut = concreteCuts?.find(c => c.id === cutId);
    if (!cut) return;
    
    const existingCut = selectedCuts.find(c => c.id === cutId);
    
    if (existingCut) {
      // Update quantity if already exists
      const updatedCuts = selectedCuts.map(c => 
        c.id === cutId ? { ...c, quantity: c.quantity + 1 } : c
      );
      setSelectedCuts(updatedCuts);
      saveCutsData(updatedCuts);
    } else {
      // Add new cut with quantity 1
      const newCut = {
        id: cut.id,
        cutType: cut.cut_type,
        price: cut.price,
        quantity: 1
      };
      const updatedCuts = [...selectedCuts, newCut];
      setSelectedCuts(updatedCuts);
      saveCutsData(updatedCuts);
    }
  };
  
  const handleUpdateCutQuantity = (cutId: string, quantity: number) => {
    if (quantity <= 0) {
      const updatedCuts = selectedCuts.filter(c => c.id !== cutId);
      setSelectedCuts(updatedCuts);
      saveCutsData(updatedCuts);
    } else {
      const updatedCuts = selectedCuts.map(c => 
        c.id === cutId ? { ...c, quantity } : c
      );
      setSelectedCuts(updatedCuts);
      saveCutsData(updatedCuts);
    }
  };
  
  const handleRemoveCut = (cutId: string) => {
    const updatedCuts = selectedCuts.filter(c => c.id !== cutId);
    setSelectedCuts(updatedCuts);
    saveCutsData(updatedCuts);
  };
  
  const saveCutsData = (cuts: any[]) => {
    // Calculate total cost
    const total = cuts.reduce((sum, cut) => sum + (cut.price * cut.quantity), 0);
    setCutsCost(total);
    
    // Update context
    updateQuoteData({
      concrete_cuts: JSON.stringify(cuts),
      concrete_cuts_cost: total
    });
  };
  
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
  };

  return (
    <div className="space-y-6">
      {/* Concrete Pump Section */}
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

      {/* Concrete Cuts Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Concrete Cuts</CardTitle>
        </CardHeader>
        <CardContent>
          {isCutsLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="space-y-4">
              {/* Cut selector */}
              <div>
                <Label htmlFor="cut-selector" className="mb-2 block">Add Concrete Cut</Label>
                <Select onValueChange={handleAddCut}>
                  <SelectTrigger id="cut-selector">
                    <SelectValue placeholder="Select a cut type to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {concreteCuts?.map(cut => (
                      <SelectItem key={cut.id} value={cut.id}>
                        {cut.cut_type} - ${cut.price.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected cuts list */}
              {selectedCuts.length > 0 && (
                <div className="border rounded-md">
                  <div className="bg-muted p-2 rounded-t-md grid grid-cols-12 gap-2 text-sm font-medium">
                    <div className="col-span-6">Cut Type</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Total</div>
                  </div>
                  <div className="divide-y">
                    {selectedCuts.map(cut => (
                      <div key={cut.id} className="p-2 grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6 flex items-center">
                          <button 
                            onClick={() => handleRemoveCut(cut.id)}
                            className="mr-2 text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                          {cut.cutType}
                        </div>
                        <div className="col-span-2 text-right">
                          ${cut.price.toFixed(2)}
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="1"
                            className="h-8"
                            value={cut.quantity}
                            onChange={(e) => handleUpdateCutQuantity(cut.id, parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div className="col-span-2 text-right font-medium">
                          ${(cut.price * cut.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-muted p-2 rounded-b-md flex justify-between font-medium">
                    <span>Total:</span>
                    <span>${cutsCost.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Add necessary concrete cuts for installation (e.g., expansion joints, control joints).
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Under Fence Concrete Strips Section */}
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
    </div>
  );
};
