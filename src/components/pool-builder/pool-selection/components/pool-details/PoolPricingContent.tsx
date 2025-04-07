
import React from "react";
import { Pool } from "@/types/pool";

interface PoolPricingContentProps {
  pool: Pool;
}

export const PoolPricingContent: React.FC<PoolPricingContentProps> = ({ pool }) => {
  return (
    <div className="grid grid-cols-2 gap-y-4">
      <div>
        <span className="text-muted-foreground">Base Price (ex GST):</span>
        <p className="font-medium">
          {pool.buy_price_ex_gst 
            ? `$${pool.buy_price_ex_gst.toLocaleString()}` 
            : "N/A"}
        </p>
      </div>
      <div>
        <span className="text-muted-foreground">Base Price (inc GST):</span>
        <p className="font-medium">
          {pool.buy_price_inc_gst 
            ? `$${pool.buy_price_inc_gst.toLocaleString()}` 
            : "N/A"}
        </p>
      </div>
    </div>
  );
};
