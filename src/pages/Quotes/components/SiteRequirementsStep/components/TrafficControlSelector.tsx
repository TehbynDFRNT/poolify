
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrafficControlCost } from "@/types/traffic-control-cost";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrafficControlSelectorProps {
  trafficControlId: string | undefined;
  onTrafficControlChange: (trafficControlId: string) => void;
}

export const TrafficControlSelector = ({ 
  trafficControlId, 
  onTrafficControlChange 
}: TrafficControlSelectorProps) => {
  // Fetch traffic control costs
  const { data: trafficControlCosts, isLoading } = useQuery({
    queryKey: ["traffic-control-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("traffic_control_costs")
        .select("*")
        .order("display_order");
      
      if (error) {
        console.error("Error fetching traffic control costs:", error);
        return [];
      }
      
      return data as TrafficControlCost[];
    }
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Traffic Control</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="traffic-control">Traffic Control Level</Label>
              <Select 
                value={trafficControlId || "none"} 
                onValueChange={onTrafficControlChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select if traffic control is needed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None Required</SelectItem>
                  {trafficControlCosts?.map(tc => (
                    <SelectItem key={tc.id} value={tc.id}>
                      {tc.name} - ${tc.price.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {trafficControlId && trafficControlId !== "none" && (
              <div className="text-sm text-muted-foreground">
                <p>Cost: ${trafficControlCosts?.find(tc => tc.id === trafficControlId)?.price.toFixed(2)}</p>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Traffic control may be required if the installation site is on a busy road or requires permits.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
