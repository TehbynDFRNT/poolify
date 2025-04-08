
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SaveButton } from "../SaveButton";
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

  // Get selected concrete type details
  const getSelectedConcreteType = () => {
    return CONCRETE_TYPES.find(item => item.id === selectedType);
  };

  // Get per meter rate
  const getPerMeterRate = () => {
    const concreteType = getSelectedConcreteType();
    return concreteType ? calculateExtraConcretingCost(concreteType.price, concreteType.margin) : 0;
  };

  return (
    <Card>
      <CardHeader className="bg-white pb-2 flex flex-row items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Extra Concreting</h3>
          <p className="text-muted-foreground">
            Add extra concrete to your project
          </p>
        </div>
        
        {customerId && (
          <SaveButton 
            onClick={handleSave}
            isSubmitting={isSaving}
            disabled={!selectedType || meterage <= 0}
            buttonText="Save Details"
            className="bg-primary"
          />
        )}
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="concrete-type">Concrete Type</Label>
            <Select
              value={selectedType}
              onValueChange={handleTypeChange}
              disabled={isLoading}
            >
              <SelectTrigger id="concrete-type" className="mt-2">
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
          
          <div>
            <Label htmlFor="meterage">Meterage (m²)</Label>
            <Input
              id="meterage"
              type="number"
              min="0"
              step="0.1"
              value={meterage || ""}
              onChange={handleMeterageChange}
              placeholder="Enter area in square meters"
              className="mt-2"
              disabled={!selectedType || isLoading}
            />
          </div>
        </div>
        
        {selectedType && meterage > 0 && (
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium mb-2">Cost Summary</h4>
            <div className="grid grid-cols-2 gap-y-2">
              <div>Rate per m²:</div>
              <div className="text-right">${getPerMeterRate().toFixed(2)}</div>
              
              <div>Area:</div>
              <div className="text-right">{meterage} m²</div>
              
              <div className="font-medium border-t pt-2 mt-1">Total Cost:</div>
              <div className="text-right font-medium border-t pt-2 mt-1">${totalCost.toFixed(2)}</div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Rate Breakdown</h4>
              <div className="grid grid-cols-4 gap-4">
                {/* Per m² Column */}
                <div className="col-span-2">
                  <h5 className="text-sm font-medium mb-2">Per m²</h5>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div>Base Price:</div>
                    <div className="text-right">${getSelectedConcreteType()?.price.toFixed(2)}</div>
                    
                    <div>Margin:</div>
                    <div className="text-right">${getSelectedConcreteType()?.margin.toFixed(2)}</div>
                    
                    <div className="font-medium">Materials Subtotal:</div>
                    <div className="text-right font-medium">${getPerMeterRate().toFixed(2)}</div>
                  </div>
                </div>
                
                {/* Total Column (multiplied by square meters) */}
                <div className="col-span-2">
                  <h5 className="text-sm font-medium mb-2">Total ({meterage} m²)</h5>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div>Base Price:</div>
                    <div className="text-right">${(getSelectedConcreteType()?.price || 0 * meterage).toFixed(2)}</div>
                    
                    <div>Margin:</div>
                    <div className="text-right">${(getSelectedConcreteType()?.margin || 0 * meterage).toFixed(2)}</div>
                    
                    <div className="font-medium">Materials Subtotal:</div>
                    <div className="text-right font-medium">${totalCost.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {selectedType && (
          <div className="mt-6">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isDeleting || isLoading}
            >
              {isDeleting ? "Removing..." : "Remove"}
            </button>
          </div>
        )}
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
