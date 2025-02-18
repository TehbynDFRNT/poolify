
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";

type PoolSpecificationsProps = {
  pool: Pool;
};

export const PoolSpecifications = ({ pool }: PoolSpecificationsProps) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>Pool Details</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium">Dimensions</h3>
          <p>Length: {pool.length}m</p>
          <p>Width: {pool.width}m</p>
          <p>Depth (Shallow): {pool.depth_shallow}m</p>
          <p>Depth (Deep): {pool.depth_deep}m</p>
        </div>
        <div>
          <h3 className="font-medium">Specifications</h3>
          <p>Volume: {pool.volume_liters ? `${pool.volume_liters}L` : 'N/A'}</p>
          <p>Weight: {pool.weight_kg ? `${pool.weight_kg}kg` : 'N/A'}</p>
          <p>Price (ex GST): {pool.buy_price_ex_gst ? formatCurrency(pool.buy_price_ex_gst) : 'N/A'}</p>
          <p>Price (inc GST): {pool.buy_price_inc_gst ? formatCurrency(pool.buy_price_inc_gst) : 'N/A'}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
