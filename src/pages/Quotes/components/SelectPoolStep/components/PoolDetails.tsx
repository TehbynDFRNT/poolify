
import { Pool } from "@/types/pool";
import { Card, CardContent } from "@/components/ui/card";

interface PoolDetailsProps {
  pool: Pool;
}

export const PoolDetails = ({ pool }: PoolDetailsProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Pool Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Range</dt>
            <dd className="mt-1 text-sm">{pool.range}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
            <dd className="mt-1 text-sm">{pool.length}m × {pool.width}m</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Depth</dt>
            <dd className="mt-1 text-sm">{pool.depth_shallow}m - {pool.depth_deep}m</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Volume</dt>
            <dd className="mt-1 text-sm">{pool.volume_liters ? `${(pool.volume_liters / 1000).toFixed(1)} m³` : 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Waterline</dt>
            <dd className="mt-1 text-sm">{pool.waterline_l_m ? `${pool.waterline_l_m} L/m` : 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Weight</dt>
            <dd className="mt-1 text-sm">{pool.weight_kg ? `${pool.weight_kg} kg` : 'N/A'}</dd>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
