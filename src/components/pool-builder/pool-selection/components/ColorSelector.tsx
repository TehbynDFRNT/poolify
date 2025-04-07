
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { POOL_COLORS } from "@/types/pool";

interface ColorSelectorProps {
  selectedColor: string | undefined;
  onChange: (color: string) => void;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({ selectedColor, onChange }) => {
  // Helper function to get color class
  const getColorClass = (color: string) => {
    switch (color) {
      case "Silver Mist": return "bg-gray-300";
      case "Horizon": return "bg-gray-800";
      case "Twilight": return "bg-gray-700";
      default: return "bg-gray-300";
    }
  };

  return (
    <div>
      <Label htmlFor="pool-color">Pool Color</Label>
      <div className="flex items-center gap-3 mt-2">
        <Select
          value={selectedColor}
          onValueChange={onChange}
        >
          <SelectTrigger id="pool-color" className="w-full">
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            {POOL_COLORS.map((color) => (
              <SelectItem key={color} value={color}>
                <div className="flex items-center gap-2">
                  <span className={`h-4 w-4 rounded-full ${getColorClass(color)}`}></span>
                  <span>{color}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedColor && (
          <div className={`h-8 w-8 rounded ${getColorClass(selectedColor)} border`}></div>
        )}
      </div>
    </div>
  );
};
