
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CraneCost } from "@/types/crane-cost";
import { toast } from "sonner";

interface CraneNeededSectionProps {
  poolId?: string;
}

export const CraneNeededSection = ({ poolId }: CraneNeededSectionProps) => {
  const [selectedCraneId, setSelectedCraneId] = useState<string | null>(null);

  // Fetch all crane costs data
  const { data: craneCosts, isLoading } = useQuery({
    queryKey: ["crane-costs", "default"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crane_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as CraneCost[];
    },
  });

  // Find the specific Franna crane in the list for the default option
  const frannaCrane = craneCosts?.find(cost => 
    cost.name === "Franna Crane-S20T-L1"
  );

  // Get the currently selected crane or default to Franna
  const selectedCrane = selectedCraneId 
    ? craneCosts?.find(cost => cost.id === selectedCraneId) 
    : frannaCrane;

  // Handle crane selection change
  const handleCraneChange = (craneId: string) => {
    setSelectedCraneId(craneId);
    toast.success("Crane selection updated");
  };

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
            <div className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Select Crane Type</label>
                <Select 
                  value={selectedCraneId || frannaCrane?.id || ''} 
                  onValueChange={handleCraneChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select crane type" />
                  </SelectTrigger>
                  <SelectContent>
                    {craneCosts?.map(crane => (
                      <SelectItem key={crane.id} value={crane.id}>
                        <div className="flex items-center gap-2">
                          {crane.name}
                          {crane.name === "Franna Crane-S20T-L1" && (
                            <Badge variant="outline" className="text-xs text-primary border-primary">Default</Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {selectedCrane?.name || "Crane"}
                  </span>
                  {selectedCrane?.name === "Franna Crane-S20T-L1" && (
                    <Badge variant="outline" className="text-primary border-primary">Default</Badge>
                  )}
                </div>
                <span className="text-sm font-medium">
                  ${selectedCrane?.price.toFixed(2) || "N/A"}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {selectedCrane?.name === "Franna Crane-S20T-L1" 
                ? "This is the default crane that will be used for installation. If a different crane is needed for your project, select it from the dropdown above."
                : "You've selected a non-default crane for this project. This selection will be reflected in the final quote."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
