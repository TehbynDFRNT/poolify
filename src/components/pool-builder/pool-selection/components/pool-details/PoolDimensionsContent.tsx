
import React from "react";
import { Pool } from "@/types/pool";

interface PoolDimensionsContentProps {
  pool: Pool;
}

export const PoolDimensionsContent: React.FC<PoolDimensionsContentProps> = ({ pool }) => {
  return (
    <div className="grid grid-cols-2 gap-y-4">
      <div>
        <span className="text-muted-foreground">Length:</span>
        <p className="font-medium">{pool.length} m</p>
      </div>
      <div>
        <span className="text-muted-foreground">Width:</span>
        <p className="font-medium">{pool.width} m</p>
      </div>
      <div>
        <span className="text-muted-foreground">Shallow End Depth:</span>
        <p className="font-medium">{pool.depth_shallow} m</p>
      </div>
      <div>
        <span className="text-muted-foreground">Deep End Depth:</span>
        <p className="font-medium">{pool.depth_deep} m</p>
      </div>
      <div>
        <span className="text-muted-foreground">Waterline:</span>
        <p className="font-medium">{pool.waterline_l_m ? `${pool.waterline_l_m} L/m` : "N/A"}</p>
      </div>
    </div>
  );
};
