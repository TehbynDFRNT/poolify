
import React from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface SaveButtonProps {
  onClick: () => void;
  isSubmitting: boolean;
  disabled: boolean;
  buttonText?: string;
  icon?: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "green";
}

export const SaveButton: React.FC<SaveButtonProps> = ({ 
  onClick, 
  isSubmitting, 
  disabled,
  buttonText = "Save", 
  icon = <Save className="mr-2 h-4 w-4" />,
  className,
  size = "sm",
  variant = "default"
}) => {
  const baseClassName = variant === "green" ? "bg-green-600 hover:bg-green-700" : "";
  
  return (
    <Button 
      onClick={onClick}
      disabled={isSubmitting || disabled}
      className={cn(baseClassName, className)}
      size={size}
    >
      {isSubmitting ? (
        <>
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
          Saving...
        </>
      ) : (
        <>
          {icon}
          {buttonText}
        </>
      )}
    </Button>
  );
};
