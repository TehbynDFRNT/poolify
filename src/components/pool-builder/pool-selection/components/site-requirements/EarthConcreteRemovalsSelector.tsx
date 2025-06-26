import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Shovel } from "lucide-react";

interface EarthConcreteRemovalsSelectorProps {
  removeSlab: string | undefined;
  onRemoveSlabChange: (value: string) => void;
  earthmoving: string | undefined;
  onEarthmovingChange: (value: string) => void;
  removeSlabSqm: string;
  onRemoveSlabSqmChange: (value: string) => void;
  earthmovingCubicMeters: string;
  onEarthmovingCubicMetersChange: (value: string) => void;
  onAutoAddRequirement?: (requirement: {
    description: string;
    cost: number;
    margin: number;
  }) => void;
}

export const EarthConcreteRemovalsSelector: React.FC<EarthConcreteRemovalsSelectorProps> = ({
  removeSlab,
  onRemoveSlabChange,
  earthmoving,
  onEarthmovingChange,
  removeSlabSqm,
  onRemoveSlabSqmChange,
  earthmovingCubicMeters,
  onEarthmovingCubicMetersChange,
  onAutoAddRequirement,
}) => {
  
  // Show input fields when selection is not "none" or "No"
  const showSlabInput = removeSlab && removeSlab !== "none" && removeSlab !== "No";
  const showEarthInput = earthmoving && earthmoving !== "none" && earthmoving !== "No";
  
  // Handle earthworks selection change
  useEffect(() => {
    if (!showEarthInput) {
      // Clear the cubic meters when earthmoving is deselected
      onEarthmovingCubicMetersChange("");
    }
  }, [showEarthInput, onEarthmovingCubicMetersChange]);
  
  // Handle slab selection change
  useEffect(() => {
    if (!showSlabInput) {
      // Clear the square meters when slab removal is deselected
      onRemoveSlabSqmChange("");
    }
  }, [showSlabInput, onRemoveSlabSqmChange]);
  
  // Handle earthworks cubic meters change
  useEffect(() => {
    if (showEarthInput && earthmovingCubicMeters && onAutoAddRequirement) {
      const cubicMeters = parseFloat(earthmovingCubicMeters);
      if (!isNaN(cubicMeters) && cubicMeters > 0) {
        const cost = (cubicMeters / 10) * 500;
        const margin = (cubicMeters / 10) * 100;
        
        onAutoAddRequirement({
          description: `Earthmoving - ${cubicMeters}m³`,
          cost: cost,
          margin: margin
        });
      }
    }
  }, [earthmovingCubicMeters, showEarthInput]); // Remove onAutoAddRequirement from deps
  
  // Handle slab square meters change
  useEffect(() => {
    if (showSlabInput && removeSlabSqm && onAutoAddRequirement) {
      const squareMeters = parseFloat(removeSlabSqm);
      if (!isNaN(squareMeters) && squareMeters > 0) {
        const cost = 170 * squareMeters;
        const margin = 34 * squareMeters;
        
        onAutoAddRequirement({
          description: `Concrete Slab Removal - ${squareMeters}m²`,
          cost: cost,
          margin: margin
        });
      }
    }
  }, [removeSlabSqm, showSlabInput]); // Remove onAutoAddRequirement from deps
  return (
    <div>
      <div className="pb-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Earth & Concrete Removals</h3>
          <Shovel className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="space-y-4">
        {/* Remove Slab */}
        <div>
          <Label htmlFor="remove-slab">Concrete Slab Removal</Label>
          <Select value={removeSlab || "none"} onValueChange={onRemoveSlabChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select slab removal requirement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None Selected</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="<6m">&lt;6m</SelectItem>
              <SelectItem value=">6m">&gt;6m</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Area of concrete slab that needs to be removed
          </p>
          
          {/* Conditional input for exact square meters */}
          {showSlabInput && (
            <div className="mt-3">
              <Label htmlFor="slab-sqm">Exact Square Meters</Label>
              <Input
                id="slab-sqm"
                type="number"
                placeholder="Enter square meters"
                value={removeSlabSqm}
                onChange={(e) => onRemoveSlabSqmChange(e.target.value)}
                className="mt-1"
              />
              {removeSlabSqm && parseFloat(removeSlabSqm) > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  A custom site requirement has been added!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Earthmoving */}
        <div>
          <Label htmlFor="earthmoving">Earthmoving (Batter, PreCut, Misc)</Label>
          <Select value={earthmoving || "none"} onValueChange={onEarthmovingChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select earthmoving requirement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None Selected</SelectItem>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="10-30m3">10-30m³</SelectItem>
              <SelectItem value="30-60m3">30-60m³</SelectItem>
              <SelectItem value="60m3+">60m³+</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            Volume of earth that needs to be moved (cubic meters)
          </p>
          
          {/* Conditional input for exact cubic meters */}
          {showEarthInput && (
            <div className="mt-3">
              <Label htmlFor="earth-cubic">Exact Cubic Meters</Label>
              <Input
                id="earth-cubic"
                type="number"
                placeholder="Enter cubic meters"
                value={earthmovingCubicMeters}
                onChange={(e) => onEarthmovingCubicMetersChange(e.target.value)}
                className="mt-1"
              />
              {earthmovingCubicMeters && parseFloat(earthmovingCubicMeters) > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  A custom site requirement has been added!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};