
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RetainingWall } from "@/types/retaining-wall";
import { formatCurrency } from "@/utils/format";

interface WallTypeSelectorProps {
  selectedWallType: string;
  retainingWalls?: RetainingWall[];
  isLoadingWalls: boolean;
  wallNumber: number;
  isLoading: boolean;
  onSelectWallType: (value: string) => void;
}

export const WallTypeSelector: React.FC<WallTypeSelectorProps> = ({
  selectedWallType,
  retainingWalls,
  isLoadingWalls,
  wallNumber,
  isLoading,
  onSelectWallType,
}) => {
  return (
    <div>
      <Label htmlFor={`wallType${wallNumber}`}>Wall Type</Label>
      <Select
        value={selectedWallType}
        onValueChange={onSelectWallType}
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
  );
};
