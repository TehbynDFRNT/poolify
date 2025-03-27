
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SquareDashedBottom, Truck, Scissors, Fence } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useConcretePump } from "@/pages/ConstructionCosts/hooks/useConcretePump";
import { useConcreteCuts } from "@/pages/ConstructionCosts/hooks/useConcreteCuts";
import { useUnderFenceConcreteStrips } from "@/pages/ConstructionCosts/hooks/useUnderFenceConcreteStrips";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { Skeleton } from "@/components/ui/skeleton";
import { ConcreteCut } from "@/types/concrete-cut";
import { ConcreteCutSelection, UnderFenceConcreteStripSelection } from "@/pages/Quotes/components/ExtraPavingStep/types";

export const ConcreteExtras: React.FC = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const { concretePump, isLoading: isPumpLoading } = useConcretePump();
  const { concreteCuts, isLoading: isCutsLoading } = useConcreteCuts();
  const { underFenceConcreteStrips, isLoading: isStripsLoading } = useUnderFenceConcreteStrips();
  const [isPumpRequired, setIsPumpRequired] = useState(quoteData.concrete_pump_required || false);
  
  // Initialize concrete cuts from quote data
  const [selectedCuts, setSelectedCuts] = useState<ConcreteCutSelection[]>(() => {
    try {
      if (quoteData.concrete_cuts && quoteData.concrete_cuts.trim() !== "") {
        const parsed = JSON.parse(quoteData.concrete_cuts);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error("Error parsing concrete cuts:", e);
    }
    return [];
  });
  
  // Initialize under fence concrete strips from quote data
  const [selectedStrips, setSelectedStrips] = useState<UnderFenceConcreteStripSelection[]>(() => {
    try {
      if (quoteData.under_fence_strips_data) {
        const parsed = Array.isArray(quoteData.under_fence_strips_data) 
          ? quoteData.under_fence_strips_data 
          : JSON.parse(quoteData.under_fence_strips_data);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error("Error parsing under fence concrete strips:", e);
    }
    return [];
  });

  // Update quote data when selectedCuts changes
  useEffect(() => {
    const totalCutsCost = selectedCuts.reduce((total, cut) => 
      total + (cut.price * cut.quantity), 0
    );
    
    updateQuoteData({
      concrete_cuts: JSON.stringify(selectedCuts),
      concrete_cuts_cost: totalCutsCost
    });
  }, [selectedCuts, updateQuoteData]);
  
  // Update quote data when selectedStrips changes
  useEffect(() => {
    const totalStripsCost = selectedStrips.reduce((total, strip) => 
      total + (strip.cost * strip.quantity), 0
    );
    
    updateQuoteData({
      under_fence_strips_data: selectedStrips,
      under_fence_strips_cost: totalStripsCost
    });
  }, [selectedStrips, updateQuoteData]);

  const handleTogglePump = (checked: boolean) => {
    setIsPumpRequired(checked);
    
    // Update quote data with pump information
    updateQuoteData({
      concrete_pump_required: checked,
      concrete_pump_price: checked && concretePump ? concretePump.price : 0
    });
  };

  // Add a concrete cut with quantity 1
  const handleAddCut = (cut: ConcreteCut) => {
    const existingCut = selectedCuts.find(c => c.id === cut.id);
    
    if (existingCut) {
      // If already exists, update quantity
      const updatedCuts = selectedCuts.map(c => 
        c.id === cut.id ? { ...c, quantity: c.quantity + 1 } : c
      );
      setSelectedCuts(updatedCuts);
    } else {
      // Add new cut with quantity 1
      setSelectedCuts([...selectedCuts, { 
        id: cut.id, 
        cut_type: cut.cut_type, 
        price: cut.price, 
        quantity: 1 
      }]);
    }
  };
  
  // Update quantity of a concrete cut
  const handleUpdateCutQuantity = (cutId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      const updatedCuts = selectedCuts.filter(c => c.id !== cutId);
      setSelectedCuts(updatedCuts);
    } else {
      // Update quantity
      const updatedCuts = selectedCuts.map(c => 
        c.id === cutId ? { ...c, quantity } : c
      );
      setSelectedCuts(updatedCuts);
    }
  };
  
  // Remove a concrete cut
  const handleRemoveCut = (cutId: string) => {
    const updatedCuts = selectedCuts.filter(c => c.id !== cutId);
    setSelectedCuts(updatedCuts);
  };
  
  // Add a concrete strip with quantity 1
  const handleAddStrip = (strip: any) => {
    const existingStrip = selectedStrips.find(s => s.id === strip.id);
    
    if (existingStrip) {
      // If already exists, update quantity
      const updatedStrips = selectedStrips.map(s => 
        s.id === strip.id ? { ...s, quantity: s.quantity + 1 } : s
      );
      setSelectedStrips(updatedStrips);
    } else {
      // Add new strip with quantity 1
      setSelectedStrips([...selectedStrips, { 
        id: strip.id, 
        type: strip.type, 
        cost: strip.cost,
        margin: strip.margin,
        quantity: 1 
      }]);
    }
  };
  
  // Update quantity of a concrete strip
  const handleUpdateStripQuantity = (stripId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      const updatedStrips = selectedStrips.filter(s => s.id !== stripId);
      setSelectedStrips(updatedStrips);
    } else {
      // Update quantity
      const updatedStrips = selectedStrips.map(s => 
        s.id === stripId ? { ...s, quantity } : s
      );
      setSelectedStrips(updatedStrips);
    }
  };
  
  // Remove a concrete strip
  const handleRemoveStrip = (stripId: string) => {
    const updatedStrips = selectedStrips.filter(s => s.id !== stripId);
    setSelectedStrips(updatedStrips);
  };
  
  // Calculate total cost of cuts
  const calculateTotalCutsCost = () => {
    return selectedCuts.reduce((total, cut) => 
      total + (cut.price * cut.quantity), 0
    );
  };
  
  // Calculate total cost of strips
  const calculateTotalStripsCost = () => {
    return selectedStrips.reduce((total, strip) => 
      total + (strip.cost * strip.quantity), 0
    );
  };
  
  // Group cuts by type
  const groupCuts = () => {
    if (!concreteCuts) return { standardCuts: [], diagonalCuts: [] };
    
    const standardCuts = concreteCuts.filter(cut => 
      !cut.cut_type.toLowerCase().includes('diagonal')
    );
    
    const diagonalCuts = concreteCuts.filter(cut => 
      cut.cut_type.toLowerCase().includes('diagonal')
    );
    
    return { standardCuts, diagonalCuts };
  };
  
  const { standardCuts, diagonalCuts } = groupCuts();

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
            
            {isPumpLoading ? (
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
                    onCheckedChange={handleTogglePump} 
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
          
          {/* Concrete Cuts Section */}
          <div className="rounded-md border p-4">
            <div className="flex items-center gap-3 mb-4">
              <Scissors className="h-5 w-5 text-gray-500" />
              <h4 className="text-base font-medium">Concrete Cuts</h4>
            </div>
            
            {isCutsLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="space-y-4">
                {/* Available cuts to add */}
                <div>
                  <Label className="mb-2 block">Available Concrete Cuts</Label>
                  
                  {/* Standard Cuts */}
                  {standardCuts.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {standardCuts.map(cut => (
                        <Button 
                          key={cut.id} 
                          variant="outline" 
                          className="justify-between"
                          onClick={() => handleAddCut(cut)}
                        >
                          <span>{cut.cut_type}</span>
                          <span className="font-bold">${cut.price.toFixed(2)}</span>
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {/* Diagonal Cuts */}
                  {diagonalCuts.length > 0 && (
                    <div className="mt-4">
                      <Label className="mb-2 block">Diagonal Cuts</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {diagonalCuts.map(cut => (
                          <Button 
                            key={cut.id} 
                            variant="outline" 
                            className="justify-between"
                            onClick={() => handleAddCut(cut)}
                          >
                            <span>{cut.cut_type}</span>
                            <span className="font-bold">${cut.price.toFixed(2)}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Selected cuts table */}
                {selectedCuts.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="block">Selected Concrete Cuts</Label>
                      <div className="text-lg font-semibold">
                        Total: ${calculateTotalCutsCost().toFixed(2)}
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedCuts.map(cut => (
                          <TableRow key={cut.id}>
                            <TableCell>{cut.cut_type}</TableCell>
                            <TableCell>${cut.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                min="1"
                                value={cut.quantity}
                                onChange={(e) => handleUpdateCutQuantity(cut.id, parseInt(e.target.value) || 0)}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              ${(cut.price * cut.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveCut(cut.id)}
                                className="h-8 w-8 p-0 text-red-500"
                              >
                                <span className="sr-only">Remove</span>
                                <Scissors className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Add concrete cuts required for this installation. Multiple cuts of the same type can be added by adjusting the quantity.
                </p>
              </div>
            )}
          </div>
          
          {/* Under Fence Concrete Strips Section */}
          <div className="rounded-md border p-4">
            <div className="flex items-center gap-3 mb-4">
              <Fence className="h-5 w-5 text-gray-500" />
              <h4 className="text-base font-medium">Under Fence Concrete Strips</h4>
            </div>
            
            {isStripsLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <div className="space-y-4">
                {/* Available strips to add */}
                <div>
                  <Label className="mb-2 block">Available Concrete Strips</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {underFenceConcreteStrips?.map(strip => (
                      <Button 
                        key={strip.id} 
                        variant="outline" 
                        className="justify-between"
                        onClick={() => handleAddStrip(strip)}
                      >
                        <span>{strip.type}</span>
                        <span className="font-bold">${strip.cost.toFixed(2)}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                {/* Selected strips table */}
                {selectedStrips.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="block">Selected Concrete Strips</Label>
                      <div className="text-lg font-semibold">
                        Total: ${calculateTotalStripsCost().toFixed(2)}
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Cost</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedStrips.map(strip => (
                          <TableRow key={strip.id}>
                            <TableCell>{strip.type}</TableCell>
                            <TableCell>${strip.cost.toFixed(2)}</TableCell>
                            <TableCell>
                              <Input 
                                type="number" 
                                min="1"
                                value={strip.quantity}
                                onChange={(e) => handleUpdateStripQuantity(strip.id, parseInt(e.target.value) || 0)}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              ${(strip.cost * strip.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveStrip(strip.id)}
                                className="h-8 w-8 p-0 text-red-500"
                              >
                                <span className="sr-only">Remove</span>
                                <Fence className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Add under fence concrete strips required for this installation. Multiple strips of the same type can be added by adjusting the quantity.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
