
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { RetainingWall, WALL_TYPES } from "@/types/retaining-wall";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Save, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { FormActions } from "@/pages/Quotes/components/ExtraPavingStep/components/PavingOnExistingConcrete/components/FormActions";

interface RetainingWallCalculatorProps {
  customerId?: string | null;
}

export const RetainingWallCalculator: React.FC<RetainingWallCalculatorProps> = ({ 
  customerId 
}) => {
  const [selectedWallType, setSelectedWallType] = useState<string>("");
  const [height1, setHeight1] = useState<number>(0);
  const [height2, setHeight2] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [squareMeters, setSquareMeters] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [selectedWall, setSelectedWall] = useState<RetainingWall | null>(null);
  const [marginAmount, setMarginAmount] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasExistingData, setHasExistingData] = useState<boolean>(false);

  const { data: retainingWalls, isLoading: isLoadingWalls } = useQuery({
    queryKey: ["retainingWalls"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retaining_walls")
        .select("*")
        .order('type', { ascending: true });

      if (error) {
        console.error("Error fetching retaining walls:", error);
        throw error;
      }

      return data as RetainingWall[];
    },
  });

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
        .select('retaining_wall_type, retaining_wall_height1, retaining_wall_height2, retaining_wall_length, retaining_wall_total_cost')
        .eq('id', customerId)
        .single();

      if (error) {
        console.error("Error fetching retaining wall data:", error);
      } else if (data) {
        if (data.retaining_wall_type) {
          setSelectedWallType(data.retaining_wall_type);
          setHasExistingData(true);
        }
        
        if (data.retaining_wall_height1) {
          setHeight1(data.retaining_wall_height1);
        }
        
        if (data.retaining_wall_height2) {
          setHeight2(data.retaining_wall_height2);
        }
        
        if (data.retaining_wall_length) {
          setLength(data.retaining_wall_length);
        }
      }
    } catch (error) {
      console.error("Error fetching retaining wall data:", error);
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
      const { error } = await supabase
        .from('pool_projects')
        .update({
          retaining_wall_type: selectedWallType,
          retaining_wall_height1: height1,
          retaining_wall_height2: height2,
          retaining_wall_length: length,
          retaining_wall_total_cost: totalCost
        })
        .eq('id', customerId);

      if (error) throw error;
      
      toast.success("Retaining wall details saved successfully");
      setHasExistingData(true);
    } catch (error) {
      console.error("Error saving retaining wall data:", error);
      toast.error("Failed to save retaining wall details");
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
      const { error } = await supabase
        .from('pool_projects')
        .update({
          retaining_wall_type: null,
          retaining_wall_height1: null,
          retaining_wall_height2: null,
          retaining_wall_length: null,
          retaining_wall_total_cost: null
        })
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
      toast.success("Retaining wall removed successfully");
    } catch (error) {
      console.error("Error removing retaining wall data:", error);
      toast.error("Failed to remove retaining wall");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Retaining Wall Calculator</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="wallType">Wall Type</Label>
              <Select
                value={selectedWallType}
                onValueChange={setSelectedWallType}
                disabled={isLoading}
              >
                <SelectTrigger id="wallType" className="w-full">
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
                <Label htmlFor="height1">Height 1 (m)</Label>
                <Input
                  id="height1"
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
                <Label htmlFor="height2">Height 2 (m)</Label>
                <Input
                  id="height2"
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
                <Label htmlFor="length">Length (m)</Label>
                <Input
                  id="length"
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
          <div className="mt-6 bg-slate-50 p-4 rounded-md">
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
            <FormActions 
              onSave={handleSave}
              onDelete={() => setShowDeleteConfirm(true)}
              isSubmitting={isSaving}
              isDeleting={isDeleting}
              hasExistingData={hasExistingData}
            />
          )}
        </div>
      </CardContent>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Retaining Wall</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the retaining wall data? This action cannot be undone.
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
