import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useConcretePump } from "@/pages/ConstructionCosts/hooks/useConcretePump";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { Truck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useConcretePavingActionsGuarded } from "../../hooks/useConcretePavingActionsGuarded";
import { SaveButton } from "../SaveButton";

interface ExtraConcretingProps {
  pool: Pool;
  customerId: string;
  onSaveComplete?: () => void;
}

// Concrete finish options
const CONCRETE_FINISH_OPTIONS = [
  "Brushed - Ready for Future Paving",
  "Brushed - Second Pour",
  "Second Pour",
  "Smooth - Ready for Imitation Turf",
  "Smooth - Second Pour"
];

export const ExtraConcreting: React.FC<ExtraConcretingProps> = ({
  pool,
  customerId,
  onSaveComplete
}) => {
  const [selectedType, setSelectedType] = useState<string>("");
  const [meterage, setMeterage] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [concreteFinishOne, setConcreteFinishOne] = useState<string>("");
  const [concreteFinishTwo, setConcreteFinishTwo] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Concrete pump state
  const [extraConcretePumpNeeded, setExtraConcretePumpNeeded] = useState<boolean>(false);
  const [extraConcretePumpQuantity, setExtraConcretePumpQuantity] = useState<number>(1);
  const [extraConcretePumpTotalCost, setExtraConcretePumpTotalCost] = useState<number>(0);

  // Use the guarded actions hook
  const {
    handleSave,
    isSubmitting,
    StatusWarningDialog
  } = useConcretePavingActionsGuarded(customerId);

  // Get concrete pump base rate from database
  const { concretePump } = useConcretePump();

  // Default pump rate if data is not loaded yet
  const pumpRate = concretePump ? concretePump.price : 1050.00;

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
      
      // Fetch extra concreting data from pool_paving_selections
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

        if ((data as any).extra_concrete_finish_one) {
          setConcreteFinishOne((data as any).extra_concrete_finish_one);
        }

        if ((data as any).extra_concrete_finish_two) {
          setConcreteFinishTwo((data as any).extra_concrete_finish_two);
        }
      }

      // Fetch concrete pump data from pool_concrete_selections
      const { data: pumpData, error: pumpError } = await supabase
        .from('pool_concrete_selections')
        .select('extra_concrete_pump, extra_concrete_pump_quantity, extra_concrete_pump_total_cost')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      if (pumpError && pumpError.code !== 'PGRST116') {
        console.error("Error fetching concrete pump data:", pumpError);
      } else if (pumpData) {
        // Type assertion to handle the data properly
        const typedPumpData = pumpData as {
          extra_concrete_pump: boolean | null;
          extra_concrete_pump_quantity: number | null;
          extra_concrete_pump_total_cost: number | null;
        };
        
        setExtraConcretePumpNeeded(typedPumpData.extra_concrete_pump || false);
        setExtraConcretePumpQuantity(typedPumpData.extra_concrete_pump_quantity || 1);
        setExtraConcretePumpTotalCost(typedPumpData.extra_concrete_pump_total_cost || 0);
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
    // Save to pool_paving_selections table (existing extra concreting data)
    const pavingDataToSave = {
      extra_concreting_type: selectedType || null,
      extra_concreting_square_meters: meterage || null,
      extra_concreting_total_cost: totalCost || null,
      extra_concrete_finish_one: concreteFinishOne || null,
      extra_concrete_finish_two: concreteFinishTwo || null
    };

    const pavingResult = await handleSave(pavingDataToSave, 'pool_paving_selections');

    // Save to pool_concrete_selections table (concrete pump data)
    const concreteDataToSave = {
      extra_concrete_pump: extraConcretePumpNeeded,
      extra_concrete_pump_quantity: extraConcretePumpNeeded ? extraConcretePumpQuantity : null,
      extra_concrete_pump_total_cost: extraConcretePumpNeeded ? extraConcretePumpTotalCost : 0
    };

    const concreteResult = await handleSave(concreteDataToSave, 'pool_concrete_selections');

    if (pavingResult.success && concreteResult.success) {
      if (onSaveComplete) {
        onSaveComplete();
      }
    }
  };

  // Handle delete using the guarded hook
  const handleDeleteClick = async () => {
    // Clear all extra concreting related fields
    const pavingDataToClear = {
      extra_concreting_type: null,
      extra_concreting_square_meters: null,
      extra_concreting_total_cost: null,
      extra_concrete_finish_one: null,
      extra_concrete_finish_two: null
    };

    const pavingResult = await handleSave(pavingDataToClear, 'pool_paving_selections');

    // Also clear the extra concrete pump data
    const concreteDataToClear = {
      extra_concrete_pump: false,
      extra_concrete_pump_quantity: null,
      extra_concrete_pump_total_cost: 0
    };

    const concreteResult = await handleSave(concreteDataToClear, 'pool_concrete_selections');

    if (pavingResult.success && concreteResult.success) {
      // Reset form
      setSelectedType('');
      setMeterage(0);
      setTotalCost(0);
      setConcreteFinishOne('');
      setConcreteFinishTwo('');
      setExtraConcretePumpNeeded(false);
      setExtraConcretePumpQuantity(0);
      setExtraConcretePumpTotalCost(0);
      setShowDeleteConfirm(false);
      
      toast.success("Extra concreting details removed successfully.");

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

  // Handle pump toggle
  const handlePumpToggle = (checked: boolean) => {
    setExtraConcretePumpNeeded(checked);
    if (!checked) {
      setExtraConcretePumpQuantity(1);
    }
  };

  // Handle pump quantity change
  const handlePumpQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setExtraConcretePumpQuantity(isNaN(value) || value < 1 ? 1 : value);
  };

  // Calculate pump cost whenever pump status or quantity changes
  useEffect(() => {
    if (extraConcretePumpNeeded && extraConcretePumpQuantity > 0) {
      setExtraConcretePumpTotalCost(pumpRate * extraConcretePumpQuantity);
    } else {
      setExtraConcretePumpTotalCost(0);
    }
  }, [extraConcretePumpNeeded, extraConcretePumpQuantity, pumpRate]);

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
            disabled={false}
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

          <div>
            <Label htmlFor="concrete-finish-one">Concrete Finish 1</Label>
            <Select
              value={concreteFinishOne}
              onValueChange={setConcreteFinishOne}
              disabled={isLoading}
            >
              <SelectTrigger id="concrete-finish-one" className="mt-2">
                <SelectValue placeholder="Select finish option" />
              </SelectTrigger>
              <SelectContent>
                {CONCRETE_FINISH_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="concrete-finish-two">Concrete Finish 2</Label>
            <Select
              value={concreteFinishTwo}
              onValueChange={setConcreteFinishTwo}
              disabled={isLoading}
            >
              <SelectTrigger id="concrete-finish-two" className="mt-2">
                <SelectValue placeholder="Select finish option" />
              </SelectTrigger>
              <SelectContent>
                {CONCRETE_FINISH_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Concrete Pump Section */}
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="h-5 w-5 text-primary" />
            <h4 className="text-lg font-semibold">Extra Concrete Pump</h4>
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="extra-pump-needed"
                checked={extraConcretePumpNeeded}
                onCheckedChange={handlePumpToggle}
                disabled={isLoading}
              />
              <Label htmlFor="extra-pump-needed" className="font-medium">
                Extra Concrete Pump Required
              </Label>
            </div>

            <div className="text-sm text-muted-foreground">
              Base rate: {formatCurrency(pumpRate)}/day
            </div>
          </div>

          {extraConcretePumpNeeded && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <Label htmlFor="pump-quantity" className="font-medium">
                    Number of Days/Instances Required
                  </Label>
                  <Input
                    id="pump-quantity"
                    type="number"
                    min="1"
                    value={extraConcretePumpQuantity}
                    onChange={handlePumpQuantityChange}
                    className="mt-2"
                    disabled={isLoading || !extraConcretePumpNeeded}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h5 className="font-medium mb-2">Pump Cost Summary</h5>
                <div className="grid grid-cols-2 gap-y-2">
                  <div>Rate per day:</div>
                  <div className="text-right">{formatCurrency(pumpRate)}</div>

                  <div>Number of days:</div>
                  <div className="text-right">{extraConcretePumpQuantity}</div>

                  <div className="font-medium border-t pt-2 mt-1">Pump Total:</div>
                  <div className="text-right font-medium border-t pt-2 mt-1">{formatCurrency(extraConcretePumpTotalCost)}</div>
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                  <p>This is based on the standard formula: Rate × Number of Days</p>
                  <p className="mt-1">Example: {formatCurrency(pumpRate)} × {extraConcretePumpQuantity} = {formatCurrency(extraConcretePumpTotalCost)}</p>
                </div>
              </div>
            </>
          )}
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
