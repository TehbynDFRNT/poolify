
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PoolSpecifications = () => {
  const { data: pools, isLoading } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select(`
          *,
          pool_type:pool_types(name)
        `);

      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Pool Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[800px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Dig Level</TableHead>
                  <TableHead>Pool Size</TableHead>
                  <TableHead>Length</TableHead>
                  <TableHead>Width</TableHead>
                  <TableHead>Shallow End</TableHead>
                  <TableHead>Deep End</TableHead>
                  <TableHead>Waterline L/M</TableHead>
                  <TableHead>Water Volume (L)</TableHead>
                  <TableHead>Salt Volume Bags</TableHead>
                  <TableHead>Salt Volume Fixed</TableHead>
                  <TableHead>Weight (KG)</TableHead>
                  <TableHead>Minerals Initial/Topup</TableHead>
                  <TableHead>Buy Price (ex GST)</TableHead>
                  <TableHead>Buy Price (inc GST)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pools?.map((pool) => (
                  <TableRow key={pool.id}>
                    <TableCell>{pool.name}</TableCell>
                    <TableCell>{pool.dig_level}</TableCell>
                    <TableCell>{pool.pool_type?.name}</TableCell>
                    <TableCell>{pool.length}m</TableCell>
                    <TableCell>{pool.width}m</TableCell>
                    <TableCell>{pool.depth_shallow}m</TableCell>
                    <TableCell>{pool.depth_deep}m</TableCell>
                    <TableCell>{pool.waterline_l_m}</TableCell>
                    <TableCell>{pool.volume_liters}</TableCell>
                    <TableCell>{pool.salt_volume_bags}</TableCell>
                    <TableCell>{pool.salt_volume_bags_fixed}</TableCell>
                    <TableCell>{pool.weight_kg}</TableCell>
                    <TableCell>
                      {pool.minerals_kg_initial}/{pool.minerals_kg_topup}
                    </TableCell>
                    <TableCell>{formatCurrency(pool.buy_price_ex_gst)}</TableCell>
                    <TableCell>{formatCurrency(pool.buy_price_inc_gst)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoolSpecifications;
