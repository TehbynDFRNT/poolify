import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConcretePavingActionsGuarded } from "../../hooks/useConcretePavingActionsGuarded";
import { SaveButton } from "../SaveButton";

interface ExtraConcretingProps {
  pool: Pool;
  customerId: string;
  onSaveComplete?: () => void;
}

export const ExtraConcreting: React.FC<ExtraConcretingProps> = ({
  pool,
  customerId,
  onSaveComplete
}) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [meterage, setMeterage] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Use the guarded actions hook
  const {
    handleSave,
    handleDelete,
    isSubmitting,
    StatusWarningDialog
  } = useConcretePavingActionsGuarded(customerId);

  // Fetch concrete types from the database
  const { data: concretingTypes = [], isLoading: isTypesLoading } = useQuery({
    queryKey: ['concrete-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('extra_concreting')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch existing data when component mounts
  useEffect(() => {
    if (customerId) {
      fetchExistingData();
    }
  }, [customerId]);

  // Calculate extra concreting cost with margin
  const calculateExtraConcretingCost = (price: number, margin: number) => {
    return price * (1 + margin / 100);
  };

  // Fetch existing extra concreting data for this customer
  const fetchExistingData = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('pool_paving_selections')
        .select('*')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching extra concreting data:", error);
        return;
      }

      if (data) {
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
      console.error("Error in fetchExistingData:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle meterage change
  const handleMeterageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setMeterage(isNaN(value) ? 0 : value);
    calculateCost(selectedType, isNaN(value) ? 0 : value);
  };

  // Calculate cost based on selected type and meterage
  const calculateCost = (type: string, meter: number) => {
    // Use the fetched concrete types instead of hardcoded values
    const selectedConcrete = concretingTypes.find(item => item.id === type);
    if (selectedConcrete && meter > 0) {
      const costPerMeter = calculateExtraConcretingCost(selectedConcrete.price, selectedConcrete.margin);
      setTotalCost(costPerMeter * meter);
    } else {
      setTotalCost(0);
    }
  };

  // Handle save using the guarded hook
  const handleSaveClick = async () => {
    if (!selectedType || meterage <= 0) {
      toast.error("Please select a concrete type and enter a valid meterage.");
      return;
    }

    // First check if a record already exists
    const { data: existingData } = await supabase
      .from('pool_paving_selections')
      .select('id')
      .eq('pool_project_id', customerId)
      .maybeSingle();

    const dataToSave = {
      extra_concreting_type: selectedType,
      extra_concreting_square_meters: meterage,
      extra_concreting_total_cost: totalCost
    };

    // Use the guarded handleSave for both insert and update
    const result = await handleSave(dataToSave, 'pool_paving_selections', existingData?.id || null);

    if (result.success) {
      if (result.newId && !existingData?.id) {
        toast.success("Extra concreting details saved successfully.");
      }
      if (onSaveComplete) {
        onSaveComplete();
      }
    }
  };

  // Handle delete using the guarded hook
  const handleDeleteClick = async () => {
    const success = await handleDelete('extra_concreting_type', 'pool_paving_selections');

    if (success) {
      // Reset form
      setSelectedType('');
      setMeterage(0);
      setTotalCost(0);
      setShowDeleteConfirm(false);

      if (onSaveComplete) {
        onSaveComplete();
      }
    }
  };

  // Get selected concrete type details - updated to use fetched data
  const getSelectedConcreteType = () => {
    return concretingTypes.find(item => item.id === selectedType);
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
            onClick={handleSaveClick}
            isSubmitting={isSubmitting}
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
              onValueChange={(value) => {
                setSelectedType(value);
                calculateCost(value, meterage);
              }}
              disabled={isLoading || isTypesLoading}
            >
              <SelectTrigger id="concrete-type" className="mt-2">
                <SelectValue placeholder="Select concrete type" />
              </SelectTrigger>
              <SelectContent>
                {isTypesLoading ? (
                  <SelectItem value="loading" disabled>Loading concrete types...</SelectItem>
                ) : (
                  concretingTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.type} (${calculateExtraConcretingCost(type.price, type.margin).toFixed(2)}/m²)
                    </SelectItem>
                  ))
                )}
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
                    <div className="text-right">${((getSelectedConcreteType()?.price || 0) * meterage).toFixed(2)}</div>

                    <div>Margin:</div>
                    <div className="text-right">${((getSelectedConcreteType()?.margin || 0) * meterage).toFixed(2)}</div>

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
            <Button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Remove
            </Button>
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
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClick}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <StatusWarningDialog />
    </Card>
  );
};
