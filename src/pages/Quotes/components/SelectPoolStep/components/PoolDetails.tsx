
import { Pool } from "@/types/pool";
import { Card, CardContent } from "@/components/ui/card";

interface PoolDetailsProps {
  pool: Pool;
}

export const PoolDetails = ({ pool }: PoolDetailsProps) => {
  // Helper to get color display class
  const getColorClass = (color?: string) => {
    switch(color) {
      case "Silver Mist": return "bg-gray-300";
      case "Ocean Blue": return "bg-blue-600";
      case "Sky Blue": return "bg-blue-400";
      case "Horizon": return "bg-gray-800";
      case "Twilight": return "bg-gray-700";
      default: return "bg-gray-300";
    }
  };

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
          {pool.color && (
            <div>
              <dt className="text-sm font-medium text-gray-500">Color</dt>
              <dd className="mt-1 text-sm flex items-center gap-2">
                <span className={`inline-block h-4 w-4 rounded-full ${getColorClass(pool.color)}`}></span>
                {pool.color}
              </dd>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
