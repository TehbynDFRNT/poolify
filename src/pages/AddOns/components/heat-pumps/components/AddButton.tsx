
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddButtonProps {
  onClick: () => void;
  label?: string;
}

export const AddButton: React.FC<AddButtonProps> = ({
  onClick,
  label = "Add New Heat Pump"
}) => {
  return (
    <Button onClick={onClick} className="whitespace-nowrap">
      <Plus className="h-4 w-4 mr-2" />
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">Add</span>
    </Button>
  );
};
