
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FormHeaderProps {
  isEditMode: boolean;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ isEditMode }) => {
  return (
    <DialogHeader>
      <DialogTitle>
        {isEditMode ? "Edit Blanket & Roller" : "Add Blanket & Roller"}
      </DialogTitle>
    </DialogHeader>
  );
};
