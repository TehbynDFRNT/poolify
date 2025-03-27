
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Scissors } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConcreteCuts } from "@/pages/ConstructionCosts/hooks/useConcreteCuts";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

interface ConcreteCutsProps {
  onChanged?: () => void;
}

export const ConcreteCuts: React.FC<ConcreteCutsProps> = ({ onChanged }) => {
  const { concreteCuts, isLoading: isCutsLoading } = useConcreteCuts();
  const { quoteData, updateQuoteData } = useQuoteContext();
  
  // Concrete cuts state
  const [selectedCuts, setSelectedCuts] = React.useState<any[]>([]);
  const [cutsCost, setCutsCost] = React.useState(0);

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
    if (onChanged) onChanged();
  };

  return (
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
  );
};
