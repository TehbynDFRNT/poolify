
import React from "react";
import { Fence } from "lucide-react";

interface FencingHeaderProps {
  title?: string;
}

const FencingHeader: React.FC<FencingHeaderProps> = ({ 
  title = "Frameless Glass Fencing" 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Fence className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>
    </div>
  );
};

export default FencingHeader;
