
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";

interface EditableCellProps {
  value: number;
  onSave: (value: number) => void;
}

export const EditableCell: React.FC<EditableCellProps> = ({ value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());
  
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    const numericValue = parseFloat(inputValue);
    if (!isNaN(numericValue)) {
      onSave(numericValue);
    } else {
      setInputValue(value.toString());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setInputValue(value.toString());
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        className="max-w-[100px]"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    );
  }

  return (
    <div 
      className="cursor-pointer hover:bg-slate-50 p-1 rounded"
      onClick={() => setIsEditing(true)}
    >
      {formatCurrency(value)}
    </div>
  );
};
