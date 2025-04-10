
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Fence } from "lucide-react";

interface FencingHeaderProps {
  title?: string;
}

const FencingHeader: React.FC<FencingHeaderProps> = ({ title = "Frameless Glass Fencing" }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Fence className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      
      <Alert className="bg-primary/5 border-primary/20">
        <div className="flex gap-2">
          <Fence className="h-4 w-4 text-primary mt-0.5" />
          <AlertDescription>
            Configure your fencing options below. All measurements are in meters and costs are in AUD.
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
};

export default FencingHeader;
