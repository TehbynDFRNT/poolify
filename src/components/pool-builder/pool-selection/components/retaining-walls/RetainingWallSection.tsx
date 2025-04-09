
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RetainingWall } from "@/types/retaining-wall";
import { formatCurrency } from "@/utils/format";
import { FormActions } from "@/pages/Quotes/components/ExtraPavingStep/components/PavingOnExistingConcrete/components/FormActions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DeleteConfirmDialog } from "@/pages/Quotes/components/ExtraPavingStep/components/PavingOnExistingConcrete/components/DeleteConfirmDialog";

interface RetainingWallSectionProps {
  customerId: string | null;
  wallNumber: number;
  retainingWalls?: RetainingWall[];
  isLoadingWalls: boolean;
  onWallUpdate?: () => void;
}

export const RetainingWallSection: React.FC<RetainingWallSectionProps> = ({
  customerId,
  wallNumber,
  retainingWalls,
  isLoadingWalls,
  onWallUpdate,
}) => {
  // Form state
  const [selectedWallType, setSelectedWallType] = useState<string>("");
  const [height1, setHeight1] = useState<number>(0);
  const [height2, setHeight2] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [selectedWall, setSelectedWall] = useState<RetainingWall | null>(null);
  const [marginAmount, setMarginAmount] = useState<number>(0);
  
  // UI state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasExistingData, setHasExistingData] = useState<boolean>(false);

  // Database column names for this wall number
  const typeField = `retaining_wall${wallNumber}_type`;
  const height1Field = `retaining_wall${wallNumber}_height1`;
  const height2Field = `retaining_wall${wallNumber}_height2`;
  const lengthField = `retaining_wall${wallNumber}_length`;
  const totalCostField = `retaining_wall${wallNumber}_total_cost`;

  // Fetch existing data when component mounts
  useEffect(() => {
    if (customerId) {
      fetchExistingData();
    }
  }, [customerId]);

  const fetchExistingData = async () => {
    if (!customerId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pool_projects')
        .select(`${typeField}, ${height1Field}, ${height2Field}, ${lengthField}, ${totalCostField}`)
        .eq('id', customerId)
        .single();

      if (error) {
        console.error(`Error fetching retaining wall ${wallNumber} data:`, error);
      } else if (data) {
        // Check if we have valid data before trying to set state
        if (data[typeField]) {
          setSelectedWallType(data[typeField]);
          setHasExistingData(true);
        }
        
        if (data[height1Field] !== null) {
          setHeight1(data[height1Field]);
        }
        
        if (data[height2Field] !== null) {
          setHeight2(data[height2Field]);
        }
        
        if (data[lengthField] !== null) {
          setLength(data[lengthField]);
        }
      }
    } catch (error) {
      console.error(`Error fetching retaining wall ${wallNumber} data:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate square meters when dimensions change
  useEffect(() => {
    if (height1 && height2 && length) {
      // Formula: ((Height 1 + Height 2) ÷ 2) × Length
      const calculatedSquareMeters = ((Number(height1) + Number(height2)) / 2) * Number(length);
      setSquareMeters(parseFloat(calculatedSquareMeters.toFixed(2)));
    } else {
      setSquareMeters(0);
    }
  }, [height1, height2, length]);

  // Calculate total cost when square meters or wall type changes
  useEffect(() => {
    if (squareMeters && selectedWall) {
      // Formula: Square Meters × Total Rate
      const calculatedTotalCost = squareMeters * selectedWall.total;
      setTotalCost(parseFloat(calculatedTotalCost.toFixed(2)));
      
      // Calculate margin amount based on the margin percentage in the selected wall
      const calculatedMarginAmount = squareMeters * selectedWall.margin;
      setMarginAmount(parseFloat(calculatedMarginAmount.toFixed(2)));
    } else {
      setTotalCost(0);
      setMarginAmount(0);
    }
  }, [squareMeters, selectedWall]);

  // Update selected wall when wall type changes
  useEffect(() => {
    if (retainingWalls && selectedWallType) {
      const wall = retainingWalls.find(w => w.type === selectedWallType);
      setSelectedWall(wall || null);
    } else {
      setSelectedWall(null);
    }
  }, [selectedWallType, retainingWalls]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? 0 : parseFloat(e.target.value);
    setter(value);
  };

  const handleSave = async () => {
    if (!customerId) {
      toast.error("No customer ID provided");
      return;
    }

    if (!selectedWallType || !height1 || !height2 || !length) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      // Create an update object with the correct field names
      const updates: Record<string, any> = {
        [typeField]: selectedWallType,
        [height1Field]: height1,
        [height2Field]: height2,
        [lengthField]: length,
        [totalCostField]: totalCost
      };

      const { error } = await supabase
        .from('pool_projects')
        .update(updates)
        .eq('id', customerId);

      if (error) throw error;
      
      toast.success(`Retaining wall ${wallNumber} details saved successfully`);
      setHasExistingData(true);
      
      // Call the onWallUpdate callback to trigger a refetch in the summary component
      if (onWallUpdate) {
        onWallUpdate();
      }
    } catch (error) {
      console.error(`Error saving retaining wall ${wallNumber} data:`, error);
      toast.error(`Failed to save retaining wall ${wallNumber} details`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!customerId) {
      toast.error("No customer ID provided");
      return;
    }

    setIsDeleting(true);
    try {
      // Create an update object with null values for this wall's fields
      const updates: Record<string, any> = {
        [typeField]: null,
        [height1Field]: null,
        [height2Field]: null,
        [lengthField]: null,
        [totalCostField]: null
      };

      const { error } = await supabase
        .from('pool_projects')
        .update(updates)
        .eq('id', customerId);

      if (error) throw error;
      
      // Reset form
      setSelectedWallType('');
      setHeight1(0);
      setHeight2(0);
      setLength(0);
      setTotalCost(0);
      setMarginAmount(0);
      
      setShowDeleteConfirm(false);
      setHasExistingData(false);
      toast.success(`Retaining wall ${wallNumber} removed successfully`);
      
      // Call the onWallUpdate callback to trigger a refetch in the summary component
      if (onWallUpdate) {
        onWallUpdate();
      }
    } catch (error) {
      console.error(`Error removing retaining wall ${wallNumber} data:`, error);
      toast.error(`Failed to remove retaining wall ${wallNumber}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="shadow-sm mb-6">
      <CardContent className="space-y-4 pt-4">
        <div className="text-xl font-semibold pt-4">Retaining Wall {wallNumber}</div>
        <div className="grid gap-4">
          <div>
            <Label htmlFor={`wallType${wallNumber}`}>Wall Type</Label>
            <Select
              value={selectedWallType}
              onValueChange={setSelectedWallType}
              disabled={isLoading}
            >
              <SelectTrigger id={`wallType${wallNumber}`} className="w-full">
                <SelectValue placeholder="Select a wall type" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingWalls ? (
                  <SelectItem value="loading">Loading wall types...</SelectItem>
                ) : (
                  retainingWalls?.map((wall) => (
                    <SelectItem key={wall.id} value={wall.type}>
                      {wall.type} ({formatCurrency(wall.total)}/m²)
                    </SelectItem>
                  )) || []
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`height1-${wallNumber}`}>Height 1 (m)</Label>
              <Input
                id={`height1-${wallNumber}`}
                type="number"
                min="0"
                step="0.1"
                value={height1 || ""}
                onChange={handleInputChange(setHeight1)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor={`height2-${wallNumber}`}>Height 2 (m)</Label>
              <Input
                id={`height2-${wallNumber}`}
                type="number"
                min="0"
                step="0.1"
                value={height2 || ""}
                onChange={handleInputChange(setHeight2)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor={`length-${wallNumber}`}>Length (m)</Label>
              <Input
                id={`length-${wallNumber}`}
                type="number"
                min="0"
                step="0.1"
                value={length || ""}
                onChange={handleInputChange(setLength)}
                className="w-full"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
        
        {selectedWall && (
          <div className="bg-slate-50 rounded-md p-3 border mt-2">
            <h4 className="font-medium text-sm mb-2">Wall Type Details:</h4>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground">Base Rate:</p>
                <p>{formatCurrency(selectedWall.rate)}/m²</p>
              </div>
              <div>
                <p className="text-muted-foreground">Extra Rate:</p>
                <p>{formatCurrency(selectedWall.extra_rate)}/m²</p>
              </div>
              <div>
                <p className="text-muted-foreground">Margin:</p>
                <p>{formatCurrency(selectedWall.margin)}/m²</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Results section */}
        <div className="mt-2 bg-slate-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Calculation Results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Square Meters:</p>
              <p className="text-lg font-medium">{squareMeters} m²</p>
              <p className="text-xs text-muted-foreground mt-1">((Height 1 + Height 2) ÷ 2) × Length</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Margin Amount:</p>
              <p className="text-lg font-medium text-green-600">{formatCurrency(marginAmount)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {squareMeters} m² × {selectedWall ? formatCurrency(selectedWall.margin) : '$0.00'}/m²
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Cost:</p>
              <p className="text-lg font-medium">{formatCurrency(totalCost)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {squareMeters} m² × {selectedWall ? formatCurrency(selectedWall.total) : '$0.00'}/m²
              </p>
            </div>
          </div>
        </div>
        
        {/* Form actions (Save/Delete buttons) */}
        {customerId && (
          <>
            <FormActions 
              onSave={handleSave}
              onDelete={() => setShowDeleteConfirm(true)}
              isSubmitting={isSaving}
              isDeleting={isDeleting}
              hasExistingData={hasExistingData}
            />
            
            <DeleteConfirmDialog
              isOpen={showDeleteConfirm}
              onClose={() => setShowDeleteConfirm(false)}
              onConfirm={handleDelete}
              isDeleting={isDeleting}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};
