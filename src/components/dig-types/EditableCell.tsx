
import React from "react";
import { Input } from "@/components/ui/input";

interface EditableCellProps {
  value: string | number;
  isEditing: boolean;
  onValueChange: (value: any) => void;
  type?: string;
  step?: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  value,
  isEditing,
  onValueChange,
  type = "text",
  step,
}) => {
  if (isEditing) {
    return (
      <Input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        type={type}
        step={step}
        className="w-full"
      />
    );
  }

  return (
    <div className="cursor-pointer p-1 rounded">
      {value}
    </div>
  );
};
