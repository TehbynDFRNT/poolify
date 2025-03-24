
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PoolCostItemProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: string) => void;
}

const PoolCostItem: React.FC<PoolCostItemProps> = ({ id, label, value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default PoolCostItem;
