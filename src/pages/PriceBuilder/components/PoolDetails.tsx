
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
  const details = [
    { label: "Range", value: pool.range },
    { label: "Name", value: pool.name },
    { label: "Length", value: `${pool.length}m` },
    { label: "Width", value: `${pool.width}m` },
    { label: "Shallow Depth", value: `${pool.depth_shallow}m` },
    { label: "Deep Depth", value: `${pool.depth_deep}m` },
    { label: "Waterline", value: pool.waterline_l_m ? `${pool.waterline_l_m}L/m` : '-' },
    { label: "Volume", value: pool.volume_liters ? `${pool.volume_liters}L` : '-' },
    { label: "Salt Bags", value: pool.salt_volume_bags || '-' },
    { label: "Weight", value: pool.weight_kg ? `${pool.weight_kg}kg` : '-' },
    { label: "Initial Minerals", value: pool.minerals_kg_initial ? `${pool.minerals_kg_initial}kg` : '-' },
    { label: "Topup Minerals", value: pool.minerals_kg_topup ? `${pool.minerals_kg_topup}kg` : '-' },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Pool Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {details.map((item, index) => (
              <div
                key={index}
                className="bg-muted/50 rounded-lg p-4 space-y-2"
              >
                <div className="text-sm text-muted-foreground">
                  {item.label}
                </div>
                <div className="text-sm font-medium">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Price (ex GST)</span>
              <span className="text-sm font-medium">
                {pool.buy_price_ex_gst ? formatCurrency(pool.buy_price_ex_gst) : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Price (inc GST)</span>
              <span className="text-sm font-medium text-primary">
                {pool.buy_price_inc_gst ? formatCurrency(pool.buy_price_inc_gst) : '-'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
