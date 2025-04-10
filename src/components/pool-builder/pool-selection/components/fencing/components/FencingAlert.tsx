
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

type AlertVariant = "info" | "warning" | "error";

interface FencingAlertProps {
  title?: string;
  description: string;
  variant?: AlertVariant;
}

const FencingAlert: React.FC<FencingAlertProps> = ({ 
  title, 
  description, 
  variant = "info" 
}) => {
  const getIcon = () => {
    switch (variant) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getStyles = () => {
    switch (variant) {
      case "warning":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "error":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  return (
    <Alert variant="default" className={getStyles()}>
      {title && <AlertTitle className="flex items-center gap-2">
        {getIcon()} {title}
      </AlertTitle>}
      <AlertDescription className={title ? "pl-6" : "flex items-center gap-2"}>
        {!title && getIcon()}
        {description}
      </AlertDescription>
    </Alert>
  );
};

export default FencingAlert;
