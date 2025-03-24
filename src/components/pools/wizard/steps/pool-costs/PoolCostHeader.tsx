
import React from "react";
import { useFormContext } from "react-hook-form";

const PoolCostHeader: React.FC = () => {
  const { watch } = useFormContext();
  const poolName = watch("name");
  
  return (
    <p className="text-muted-foreground">
      Configure individual costs for <span className="font-medium text-foreground">{poolName}</span>
    </p>
  );
};

export default PoolCostHeader;
