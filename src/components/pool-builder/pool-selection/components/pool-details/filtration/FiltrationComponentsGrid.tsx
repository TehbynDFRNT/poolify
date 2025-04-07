
import React from "react";
import { PackageWithComponents } from "@/types/filtration";
import { FiltrationComponentItem } from "./FiltrationComponentItem";

interface FiltrationComponentsGridProps {
  filtrationPackage: PackageWithComponents;
}

export const FiltrationComponentsGrid: React.FC<FiltrationComponentsGridProps> = ({ 
  filtrationPackage 
}) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <FiltrationComponentItem 
        title="Pump" 
        name={filtrationPackage.pump?.name} 
        price={filtrationPackage.pump?.price} 
      />
      
      <FiltrationComponentItem 
        title="Filter" 
        name={filtrationPackage.filter?.name} 
        price={filtrationPackage.filter?.price} 
      />
      
      <FiltrationComponentItem 
        title="Light" 
        name={filtrationPackage.light?.name} 
        price={filtrationPackage.light?.price} 
      />
      
      <FiltrationComponentItem 
        title="Sanitiser" 
        name={filtrationPackage.sanitiser?.name} 
        price={filtrationPackage.sanitiser?.price} 
      />
    </div>
  );
};
