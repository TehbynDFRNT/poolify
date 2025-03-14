
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface CraneNeededSectionProps {
  poolId?: string;
}

export const CraneNeededSection = ({ poolId }: CraneNeededSectionProps) => {
  // Fetch the default Franna crane data
  const { data: craneCosts, isLoading } = useQuery({
    queryKey: ["crane-costs", "default"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crane_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data;
    },
  });

  // Find the specific Franna crane in the list
  const frannaCrane = craneCosts?.find(cost => 
    cost.name === "Franna Crane-S20T-L1"
  );

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Crane Needed</CardTitle>
          <Construction className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {frannaCrane?.name || "Crane"}
                </span>
                <Badge variant="outline" className="text-primary border-primary">Default</Badge>
              </div>
              <span className="text-sm font-medium">
                ${frannaCrane?.price.toFixed(2) || "N/A"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              This is the default crane that will be used for installation. If a different crane is needed for your project, this will be adjusted in the final quote.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
