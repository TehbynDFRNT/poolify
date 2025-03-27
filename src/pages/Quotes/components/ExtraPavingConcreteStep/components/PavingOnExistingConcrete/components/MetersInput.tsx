
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MetersInputProps {
  meters: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const MetersInput: React.FC<MetersInputProps> = ({
  meters,
  onChange,
  disabled
}) => {
  return (
    <div>
      <Label htmlFor="meters" className="block text-gray-700 font-medium mb-1">
        Metres
      </Label>
      <Input
        id="meters"
        type="number"
        min="0"
        step="0.1"
        value={meters || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full"
        disabled={disabled}
      />
    </div>
  );
};
