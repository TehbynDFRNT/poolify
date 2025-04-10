
import React from "react";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface InfoBannerProps {
  content?: React.ReactNode;
}

const InfoBanner: React.FC<InfoBannerProps> = ({ 
  content = (
    <p className="text-sm text-blue-700">
      The frameless glass fencing cost is calculated using the formula: 
      (Lineal Meters × $396) + (Gates × $495) − One Free Gate ($495) + Panel costs + Earthing (if selected).
    </p>
  ) 
}) => {
  return (
    <Card className="bg-blue-50 border-blue-100">
      <CardContent className="p-4 flex items-start gap-2">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
        {content}
      </CardContent>
    </Card>
  );
};

export default InfoBanner;
