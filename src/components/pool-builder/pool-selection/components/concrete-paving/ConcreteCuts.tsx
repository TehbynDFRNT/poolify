import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { Scissors } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useConcretePavingActionsGuarded } from "../../hooks/useConcretePavingActionsGuarded";
import { SaveButton } from "../SaveButton";

interface ConcreteCutsProps {
  pool: Pool;
  customerId: string;
  onSaveComplete?: () => void;
}

export const ConcreteCuts: React.FC<ConcreteCutsProps> = ({ pool, customerId, onSaveComplete }) => {
  const [cutTypes, setCutTypes] = useState<any[]>([]);
  const [selectedCuts, setSelectedCuts] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Use the guarded actions hook
  const {
    handleSave,
    isSubmitting,
    StatusWarningDialog
  } = useConcretePavingActionsGuarded(customerId);

  // Fetch cut types on component mount
  useEffect(() => {
    fetchCutTypes();
    if (customerId) {
      fetchExistingData();
    }
  }, [customerId]);

  const fetchCutTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('concrete_cuts')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      if (data) {
        setCutTypes(data);
      }
    } catch (error) {
      console.error("Error fetching concrete cut types:", error);
    }
  };

  const fetchExistingData = async () => {
    try {
      const { data, error } = await supabase
        .from('pool_concrete_selections')
        .select('concrete_cuts, concrete_cuts_cost')
        .eq('pool_project_id', customerId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching existing concrete cuts data:", error);
        return;
      }

      if (data?.concrete_cuts) {
        // Parse the stored cuts data (format: "cutId:quantity,cutId:quantity")
        const cutsArray = data.concrete_cuts.split(',');
        const cuts: string[] = [];
        const qtys: Record<string, number> = {};

        cutsArray.forEach((cutData: string) => {
          const [cutId, quantity] = cutData.split(':');
          if (cutId && quantity) {
            cuts.push(cutId);
            qtys[cutId] = parseInt(quantity, 10) || 1;
          }
        });

        setSelectedCuts(cuts);
        setQuantities(qtys);
      }

      if (data?.concrete_cuts_cost) {
        setTotalCost(data.concrete_cuts_cost);
      }
    } catch (error) {
      console.error("Error in fetchExistingData:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total cost whenever selections or quantities change
  useEffect(() => {
    calculateTotalCost();
  }, [selectedCuts, quantities, cutTypes]);

  const calculateTotalCost = () => {
    let total = 0;

    selectedCuts.forEach(cutId => {
      const cutType = cutTypes.find(type => type.id === cutId);
      const quantity = quantities[cutId] || 1;

      if (cutType) {
        total += cutType.price * quantity;
      }
    });

    setTotalCost(total);
  };

  // Handle cut selection/deselection
  const handleCutSelection = (cutId: string, checked: boolean) => {
    if (checked) {
      setSelectedCuts([...selectedCuts, cutId]);
      // Initialize quantity to 1 if not already set
      if (!quantities[cutId]) {
        setQuantities({ ...quantities, [cutId]: 1 });
      }
    } else {
      setSelectedCuts(selectedCuts.filter(id => id !== cutId));
    }
  };

  // Handle quantity change
  const handleQuantityChange = (cutId: string, value: string) => {
    const quantity = parseInt(value, 10);
    setQuantities({
      ...quantities,
      [cutId]: isNaN(quantity) || quantity < 1 ? 1 : quantity
    });
  };

  // Remove a specific cut from selection
  const handleRemoveCut = (cutId: string) => {
    setSelectedCuts(selectedCuts.filter(id => id !== cutId));

    // Create a new quantities object without the removed cut
    const newQuantities = { ...quantities };
    delete newQuantities[cutId];
    setQuantities(newQuantities);
  };

  // Clear all selected cuts
  const handleClearAll = () => {
    if (selectedCuts.length === 0) return;

    if (window.confirm("Are you sure you want to remove all selected concrete cuts?")) {
      setSelectedCuts([]);
      setQuantities({});
    }
  };

  // Save concrete cuts data using the guarded hook
  const handleSaveClick = async () => {
    // Format data for storage
    const cutsData = selectedCuts.map(cutId =>
      `${cutId}:${quantities[cutId] || 1}`
    ).join(',');

    const updateData = {
      concrete_cuts: cutsData || null,
      concrete_cuts_cost: totalCost || null
    };

    // Use the guarded handleSave - it will automatically check for existing record by pool_project_id
    const result = await handleSave(updateData, 'pool_concrete_selections');

    if (result.success) {
      if (onSaveComplete) {
        onSaveComplete();
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Scissors className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold">Concrete Cuts</h3>
            </div>
            <p className="text-muted-foreground">
              Select concrete cutting services for your pool project
            </p>
          </div>

          <div className="flex gap-2">
            {selectedCuts.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            )}

            {customerId && (
              <SaveButton
                onClick={handleSaveClick}
                isSubmitting={isSubmitting}
                disabled={false}
                buttonText="Save Cuts"
                className="bg-primary"
              />
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {isLoading ? (
            <div className="text-center py-6 text-muted-foreground">
              Loading concrete cut types...
            </div>
          ) : (
            <div className="space-y-4">
              {cutTypes.map((cutType) => {
                const isSelected = selectedCuts.includes(cutType.id);
                const quantity = quantities[cutType.id] || 1;

                return (
                  <div key={cutType.id} className="border rounded-md hover:bg-slate-50 p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id={`cut-${cutType.id}`}
                        checked={isSelected}
                        onCheckedChange={(checked) =>
                          handleCutSelection(cutType.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor={`cut-${cutType.id}`} className="font-medium">
                          {cutType.cut_type}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(cutType.price)} each
                        </p>
                      </div>

                      {isSelected && (
                        <div className="flex items-end space-x-2">
                          <div>
                            <Label htmlFor={`quantity-${cutType.id}`} className="text-sm">Quantity</Label>
                            <Input
                              id={`quantity-${cutType.id}`}
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={(e) => handleQuantityChange(cutType.id, e.target.value)}
                              className="w-20 h-8"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {selectedCuts.length > 0 && (
                <div className="mt-6 bg-gray-50 p-4 rounded-md">
                  <h4 className="font-medium mb-2">Cost Summary</h4>
                  <div className="space-y-2">
                    {selectedCuts.map(cutId => {
                      const cutType = cutTypes.find(type => type.id === cutId);
                      if (!cutType) return null;

                      const quantity = quantities[cutId] || 1;
                      const itemTotal = cutType.price * quantity;

                      return (
                        <div key={cutId} className="grid grid-cols-3 gap-y-1 text-sm">
                          <span>{cutType.cut_type}</span>
                          <span className="text-right">{quantity} × {formatCurrency(cutType.price)}</span>
                          <span className="text-right">{formatCurrency(itemTotal)}</span>
                        </div>
                      );
                    })}

                    <div className="grid grid-cols-3 gap-y-1 pt-2 border-t mt-2 font-medium">
                      <span>Total</span>
                      <span></span>
                      <span className="text-right">{formatCurrency(totalCost)}</span>
                    </div>
                  </div>
                </div>
              )}

              {cutTypes.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No concrete cut types available
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <StatusWarningDialog />
    </>
  );
};
