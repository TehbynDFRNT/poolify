
import React from "react";
import { FormDescription } from "@/components/ui/form";

interface CostDescriptionProps {
  cost: number;
  unitCost: number;
  unit?: string;
  currency?: string;
}

const CostDescription: React.FC<CostDescriptionProps> = ({ 
  cost, 
  unitCost, 
  unit = "per meter", 
  currency = "$" 
}) => {
  return (
    <FormDescription className="text-xs">
      Cost: {currency}{cost.toFixed(2)} ({currency}{unitCost} {unit})
    </FormDescription>
  );
};

export default CostDescription;
