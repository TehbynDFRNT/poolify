
import React from "react";
import { PackageWithComponents } from "@/types/filtration";
import { FiltrationComponentsGrid } from "./FiltrationComponentsGrid";
import { HandoverKitSection } from "./HandoverKitSection";
import { FiltrationTotalPrice } from "./FiltrationTotalPrice";

interface FiltrationDetailsProps {
  filtrationPackage: PackageWithComponents;
}

export const FiltrationDetails: React.FC<FiltrationDetailsProps> = ({ 
  filtrationPackage 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">
        {filtrationPackage.name} (Option {filtrationPackage.display_order})
      </h3>
      
      <FiltrationComponentsGrid filtrationPackage={filtrationPackage} />
      
      {filtrationPackage.handover_kit && (
        <HandoverKitSection handoverKit={filtrationPackage.handover_kit} />
      )}
      
      <FiltrationTotalPrice filtrationPackage={filtrationPackage} />
    </div>
  );
};
