
import { useState } from "react";
import { useUnderFenceConcreteStrips } from "@/pages/ConstructionCosts/hooks/useUnderFenceConcreteStrips";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Fence } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UnderFenceConcreteStripSelection } from "../types";

interface UnderFenceConcreteStripSelectorProps {
  selectedStrips: UnderFenceConcreteStripSelection[];
  onUpdateStrips: (strips: UnderFenceConcreteStripSelection[]) => void;
}

export const UnderFenceConcreteStripSelector = ({ 
  selectedStrips,
  onUpdateStrips 
}: UnderFenceConcreteStripSelectorProps) => {
  const { underFenceConcreteStrips, isLoading } = useUnderFenceConcreteStrips();
  
  // Add a concrete strip with quantity 1
  const handleAddStrip = (strip: any) => {
    const existingStrip = selectedStrips.find(s => s.id === strip.id);
    
    if (existingStrip) {
      // If already exists, update quantity
      const updatedStrips = selectedStrips.map(s => 
        s.id === strip.id ? { ...s, quantity: s.quantity + 1 } : s
      );
      onUpdateStrips(updatedStrips);
    } else {
      // Add new strip with quantity 1
      onUpdateStrips([...selectedStrips, { 
        id: strip.id, 
        type: strip.type, 
        cost: strip.cost,
        margin: strip.margin,
        quantity: 1 
      }]);
    }
  };
  
  // Update quantity of a concrete strip
  const handleUpdateQuantity = (stripId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      const updatedStrips = selectedStrips.filter(s => s.id !== stripId);
      onUpdateStrips(updatedStrips);
    } else {
      // Update quantity
      const updatedStrips = selectedStrips.map(s => 
        s.id === stripId ? { ...s, quantity } : s
      );
      onUpdateStrips(updatedStrips);
    }
  };
  
  // Remove a concrete strip
  const handleRemoveStrip = (stripId: string) => {
    const updatedStrips = selectedStrips.filter(s => s.id !== stripId);
    onUpdateStrips(updatedStrips);
  };
  
  // Calculate total cost
  const calculateTotalCost = () => {
    return selectedStrips.reduce((total, strip) => 
      total + (strip.cost * strip.quantity), 0
    );
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Fence className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-lg font-medium">Under Fence Concrete Strip L/M</CardTitle>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">
            Total: ${calculateTotalCost().toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="space-y-6">
            {/* Available strips to add */}
            <div className="space-y-4">
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
              <div>
                <Label className="mb-2 block">Selected Concrete Strips</Label>
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
                            onChange={(e) => handleUpdateQuantity(strip.id, parseInt(e.target.value) || 0)}
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
      </CardContent>
    </Card>
  );
};
