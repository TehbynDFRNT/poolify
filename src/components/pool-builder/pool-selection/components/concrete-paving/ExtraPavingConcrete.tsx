
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Layers } from "lucide-react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { Pool } from "@/types/pool";
import { FormActions } from "./FormActions";
import { useConcretePavingActions } from "@/components/pool-builder/pool-selection/hooks/useConcretePavingActions";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ExtraPavingConcreteProps {
  pool: Pool;
  customerId: string;
}

export const ExtraPavingConcrete: React.FC<ExtraPavingConcreteProps> = ({ pool, customerId }) => {
  const { extraPavingCosts, isLoading } = useExtraPavingCosts();
  const { isSubmitting, isDeleting, handleSave, handleDelete } = useConcretePavingActions(customerId);
  
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [hasExistingData, setHasExistingData] = useState(false);
  
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!customerId) return;
      
      try {
        const { data, error } = await supabase
          .from('pool_projects')
          .select('extra_paving_category, extra_paving_square_meters')
          .eq('id', customerId)
          .single();
          
        if (error) throw error;
        
        if (data && data.extra_paving_category) {
          setSelectedPavingId(data.extra_paving_category);
          setSquareMeters(data.extra_paving_square_meters || 0);
          setHasExistingData(true);
        }
      } catch (error) {
        console.error("Error fetching extra paving data:", error);
      }
    };
    
    fetchExistingData();
  }, [customerId]);
  
  const handleSaveExtraPaving = async () => {
    if (!selectedPavingId) {
      toast.error("Please select a paving category");
      return;
    }
    
    const result = await handleSave({
      extra_paving_category: selectedPavingId,
      extra_paving_square_meters: squareMeters
    });
    
    if (result) {
      setHasExistingData(true);
    }
  };
  
  const handleDeleteExtraPaving = async () => {
    const result = await handleDelete('extra_paving_category');
    
    if (result) {
      setSelectedPavingId("");
      setSquareMeters(0);
      setHasExistingData(false);
    }
  };
  
  const selectedPaving = extraPavingCosts?.find(p => p.id === selectedPavingId);
  const totalCost = selectedPaving && squareMeters 
    ? (selectedPaving.paver_cost + selectedPaving.wastage_cost + selectedPaving.margin_cost) * squareMeters 
    : 0;
  
  return (
    <Card>
      <CardHeader className="bg-white pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-gray-500" />
            <CardTitle className="text-lg font-medium">Extra Paving</CardTitle>
          </div>
          {selectedPaving && squareMeters > 0 && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-lg font-semibold">${totalCost.toFixed(2)}</div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="paving-type">Paving Category</Label>
            <Select
              value={selectedPavingId}
              onValueChange={setSelectedPavingId}
              disabled={isLoading || isSubmitting}
            >
              <SelectTrigger id="paving-type">
                <SelectValue placeholder="Select paving type" />
              </SelectTrigger>
              <SelectContent>
                {extraPavingCosts?.map((pavingCost) => (
                  <SelectItem key={pavingCost.id} value={pavingCost.id}>
                    {pavingCost.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="square-meters">Square Meters</Label>
            <Input
              id="square-meters"
              type="number"
              min="0"
              step="0.01"
              value={squareMeters}
              onChange={(e) => setSquareMeters(Number(e.target.value))}
              disabled={isSubmitting}
            />
          </div>
          
          {selectedPaving && (
            <>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Paver Cost/m²:</span> ${selectedPaving.paver_cost.toFixed(2)}
                </div>
                <div>
                  <span className="text-muted-foreground">Wastage Cost/m²:</span> ${selectedPaving.wastage_cost.toFixed(2)}
                </div>
                <div>
                  <span className="text-muted-foreground">Margin Cost/m²:</span> ${selectedPaving.margin_cost.toFixed(2)}
                </div>
                <div>
                  <span className="text-muted-foreground">Total/m²:</span> ${(selectedPaving.paver_cost + selectedPaving.wastage_cost + selectedPaving.margin_cost).toFixed(2)}
                </div>
              </div>
            </>
          )}
          
          <FormActions
            onSave={handleSaveExtraPaving}
            onDelete={handleDeleteExtraPaving}
            isSubmitting={isSubmitting}
            isDeleting={isDeleting}
            hasExistingData={hasExistingData}
            saveText="Save Extra Paving"
          />
        </div>
      </CardContent>
    </Card>
  );
};
