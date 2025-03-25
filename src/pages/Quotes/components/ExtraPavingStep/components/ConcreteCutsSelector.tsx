
import { useState } from "react";
import { useConcreteCuts } from "@/pages/ConstructionCosts/hooks/useConcreteCuts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConcreteCutSelection } from "../types";
import { ConcreteCut as ConcreteCutType } from "@/types/concrete-cut";

interface ConcreteCutsSelectorProps {
  selectedCuts: ConcreteCutSelection[];
  onUpdateCuts: (cuts: ConcreteCutSelection[]) => void;
}

export const ConcreteCutsSelector = ({ 
  selectedCuts,
  onUpdateCuts 
}: ConcreteCutsSelectorProps) => {
  const { concreteCuts, isLoading } = useConcreteCuts();
  
  // Add a concrete cut with quantity 1
  const handleAddCut = (cut: ConcreteCutType) => {
    const existingCut = selectedCuts.find(c => c.id === cut.id);
    
    if (existingCut) {
      // If already exists, update quantity
      const updatedCuts = selectedCuts.map(c => 
        c.id === cut.id ? { ...c, quantity: c.quantity + 1 } : c
      );
      onUpdateCuts(updatedCuts);
    } else {
      // Add new cut with quantity 1
      onUpdateCuts([...selectedCuts, { 
        id: cut.id, 
        cut_type: cut.cut_type, 
        price: cut.price, 
        quantity: 1 
      }]);
    }
  };
  
  // Update quantity of a concrete cut
  const handleUpdateQuantity = (cutId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      const updatedCuts = selectedCuts.filter(c => c.id !== cutId);
      onUpdateCuts(updatedCuts);
    } else {
      // Update quantity
      const updatedCuts = selectedCuts.map(c => 
        c.id === cutId ? { ...c, quantity } : c
      );
      onUpdateCuts(updatedCuts);
    }
  };
  
  // Remove a concrete cut
  const handleRemoveCut = (cutId: string) => {
    const updatedCuts = selectedCuts.filter(c => c.id !== cutId);
    onUpdateCuts(updatedCuts);
  };
  
  // Calculate total cost
  const calculateTotalCost = () => {
    return selectedCuts.reduce((total, cut) => 
      total + (cut.price * cut.quantity), 0
    );
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Scissors className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-lg font-medium">Concrete Cuts</CardTitle>
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
            {/* Available cuts to add */}
            <div>
              <Label className="mb-2 block">Available Concrete Cuts</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {concreteCuts?.map(cut => (
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
            
            {/* Selected cuts table */}
            {selectedCuts.length > 0 && (
              <div>
                <Label className="mb-2 block">Selected Concrete Cuts</Label>
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
                            onChange={(e) => handleUpdateQuantity(cut.id, parseInt(e.target.value) || 0)}
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
      </CardContent>
    </Card>
  );
};
