
import React from "react";
import { Info } from "lucide-react";

const InfoBanner: React.FC = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-md flex items-start gap-2">
      <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
      <p className="text-sm text-blue-700">
        The frameless glass fencing cost is calculated using the formula: 
        (Lineal Meters × $396) + (Gates × $495) − One Free Gate ($495) + Panel costs + Earthing (if selected).
      </p>
    </div>
  );
};

export default InfoBanner;
