
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MetersInputProps {
  meters: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const MetersInput: React.FC<MetersInputProps> = ({
  meters,
  onChange,
  disabled = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    onChange(isNaN(value) ? 0 : value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="meters">Area (square meters)</Label>
      <Input
        id="meters"
        type="number"
        min="0"
        step="0.1"
        value={meters || ""}
        onChange={handleChange}
        className="w-full"
        placeholder="Enter area in m²"
        disabled={disabled}
      />
    </div>
  );
};
