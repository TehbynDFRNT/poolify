
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RetainingWallDimensionsProps {
  height1: number;
  height2: number;
  length: number;
  isLoading: boolean;
  onHeightChange: (field: "height1" | "height2", value: number) => void;
  onLengthChange: (value: number) => void;
}

export const RetainingWallDimensions: React.FC<RetainingWallDimensionsProps> = ({
  height1,
  height2,
  length,
  isLoading,
  onHeightChange,
  onLengthChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="height1">Height 1 (m)</Label>
        <Input
          id="height1"
          type="number"
          min="0"
          step="0.1"
          value={height1 || ""}
          onChange={(e) => onHeightChange("height1", e.target.value === "" ? 0 : parseFloat(e.target.value))}
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
          onChange={(e) => onHeightChange("height2", e.target.value === "" ? 0 : parseFloat(e.target.value))}
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
          onChange={(e) => onLengthChange(e.target.value === "" ? 0 : parseFloat(e.target.value))}
          className="w-full"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
