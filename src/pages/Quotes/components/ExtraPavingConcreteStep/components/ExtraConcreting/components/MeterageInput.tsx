
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface MeterageInputProps {
  meterage: number;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MeterageInput: React.FC<MeterageInputProps> = ({
  meterage,
  isLoading,
  onChange
}) => {
  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="meterage">Meterage (m²)</Label>
      <Input
        id="meterage"
        type="number"
        min="0"
        step="0.01"
        value={meterage || ""}
        onChange={onChange}
      />
    </div>
  );
};
