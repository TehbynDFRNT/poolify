
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

interface PoolDetailsProps {
  pool: {
    range: string;
    name: string;
    length: number;
    width: number;
    depth_shallow: number;
    depth_deep: number;
    waterline_l_m: number | null;
    volume_liters: number | null;
    salt_volume_bags: number | null;
    weight_kg: number | null;
    minerals_kg_initial: number | null;
    minerals_kg_topup: number | null;
    buy_price_ex_gst: number | null;
    buy_price_inc_gst: number | null;
  };
}

export const PoolDetails = ({ pool }: PoolDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Range</dt>
              <dd className="text-lg">{pool.range}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-lg">{pool.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Length</dt>
              <dd className="text-lg">{pool.length}m</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Width</dt>
              <dd className="text-lg">{pool.width}m</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Shallow Depth</dt>
              <dd className="text-lg">{pool.depth_shallow}m</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Deep Depth</dt>
              <dd className="text-lg">{pool.depth_deep}m</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Waterline</dt>
              <dd className="text-lg">{pool.waterline_l_m ? `${pool.waterline_l_m}L/m` : '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Volume</dt>
              <dd className="text-lg">{pool.volume_liters ? `${pool.volume_liters}L` : '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Salt Bags</dt>
              <dd className="text-lg">{pool.salt_volume_bags || '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Weight</dt>
              <dd className="text-lg">{pool.weight_kg ? `${pool.weight_kg}kg` : '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Initial Minerals</dt>
              <dd className="text-lg">{pool.minerals_kg_initial ? `${pool.minerals_kg_initial}kg` : '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Topup Minerals</dt>
              <dd className="text-lg">{pool.minerals_kg_topup ? `${pool.minerals_kg_topup}kg` : '-'}</dd>
            </div>
          </dl>
          
          <div className="border-t pt-4 mt-6 flex justify-between items-center">
            <div className="space-y-1">
              <dt className="text-sm font-medium text-gray-500">Price (ex GST)</dt>
              <dd className="text-lg">
                {pool.buy_price_ex_gst ? formatCurrency(pool.buy_price_ex_gst) : '-'}
              </dd>
            </div>
            <div className="text-right space-y-1">
              <dt className="text-sm font-medium text-gray-500">Price (inc GST)</dt>
              <dd className="text-2xl font-bold text-primary">
                {pool.buy_price_inc_gst ? formatCurrency(pool.buy_price_inc_gst) : '-'}
              </dd>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
