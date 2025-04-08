
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { calculateExtraConcretingCost } from "@/utils/calculations";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ExtraConcretingProps {
  pool: Pool;
  customerId: string;
}

// Define concrete types
const CONCRETE_TYPES = [
  { id: "cover-crete", label: "Cover Crete", price: 236, margin: 89 },
  { id: "exposed-aggregate", label: "Exposed Aggregate", price: 180, margin: 70 },
  { id: "standard", label: "Standard", price: 128, margin: 52 }
];

export const ExtraConcreting: React.FC<ExtraConcretingProps> = ({ pool, customerId }) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [meterage, setMeterage] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Fetch existing data when component mounts
  useEffect(() => {
    fetchExistingData();
  }, [customerId]);

  const fetchExistingData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pool_projects')
        .select('extra_concreting_type, extra_concreting_square_meters, extra_concreting_total_cost')
        .eq('id', customerId)
        .single();

      if (error) {
        console.error("Error fetching extra concreting data:", error);
      } else if (data) {
        if (data.extra_concreting_type) {
          setSelectedType(data.extra_concreting_type);
        }
        
        if (data.extra_concreting_square_meters) {
          setMeterage(data.extra_concreting_square_meters);
        }
        
        if (data.extra_concreting_total_cost) {
          setTotalCost(data.extra_concreting_total_cost);
        }
      }
    } catch (error) {
      console.error("Error fetching extra concreting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle select change
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    calculateCost(value, meterage);
  };

  // Handle meterage change
  const handleMeterageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setMeterage(isNaN(value) ? 0 : value);
    calculateCost(selectedType, isNaN(value) ? 0 : value);
  };

  // Calculate cost based on selected type and meterage
  const calculateCost = (type: string, meter: number) => {
    const selectedConcrete = CONCRETE_TYPES.find(item => item.id === type);
    if (selectedConcrete && meter > 0) {
      const costPerMeter = calculateExtraConcretingCost(selectedConcrete.price, selectedConcrete.margin);
      setTotalCost(costPerMeter * meter);
    } else {
      setTotalCost(0);
    }
  };

  const handleSave = async () => {
    if (!selectedType || meterage <= 0) {
      toast.error("Please select a concrete type and enter a valid meterage.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('pool_projects')
        .update({
          extra_concreting_type: selectedType,
          extra_concreting_square_meters: meterage,
          extra_concreting_total_cost: totalCost
        } as any) // Type assertion to bypass TypeScript error temporarily
        .eq('id', customerId);

      if (error) throw error;
      
      toast.success("Extra concreting details saved successfully.");
    } catch (error) {
      console.error("Error saving extra concreting:", error);
      toast.error("Failed to save extra concreting details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('pool_projects')
        .update({
          extra_concreting_type: null,
          extra_concreting_square_meters: null,
          extra_concreting_total_cost: null
        } as any) // Type assertion to bypass TypeScript error temporarily
        .eq('id', customerId);

      if (error) throw error;
      
      // Reset form
      setSelectedType('');
      setMeterage(0);
      setTotalCost(0);
      
      setShowDeleteConfirm(false);
      toast.success("Extra concreting removed successfully.");
    } catch (error) {
      console.error("Error removing extra concreting:", error);
      toast.error("Failed to remove extra concreting.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Get label from ID
  const getTypeLabel = (id: string) => {
    const type = CONCRETE_TYPES.find(item => item.id === id);
    return type ? type.label : "";
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white pb-0">
        <h3 className="text-lg font-semibold">Extra Concreting</h3>
        <p className="text-sm text-muted-foreground">Add extra concrete to your project</p>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="concrete-type">Concrete Type</Label>
            <Select
              value={selectedType}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger id="concrete-type">
                <SelectValue placeholder="Select concrete type" />
              </SelectTrigger>
              <SelectContent>
                {CONCRETE_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label} (${(type.price + type.margin).toFixed(2)}/m²)
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
              disabled={!selectedType}
            />
          </div>
        </div>
        
        {selectedType && meterage > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
            <div className="flex justify-between">
              <span className="font-medium">Total Cost:</span>
              <span className="font-bold">${totalCost.toFixed(2)}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getTypeLabel(selectedType)}: ${(calculateExtraConcretingCost(
                CONCRETE_TYPES.find(t => t.id === selectedType)?.price || 0,
                CONCRETE_TYPES.find(t => t.id === selectedType)?.margin || 0
              )).toFixed(2)} × {meterage} m²
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading || !selectedType || meterage <= 0}
            className="bg-primary"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          
          {selectedType && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting || isLoading}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </Button>
          )}
        </div>
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Extra Concreting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the extra concreting data? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
