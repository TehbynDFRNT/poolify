
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CraneCost } from "@/types/crane-cost";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Construction } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CraneSelectorProps {
  craneId: string | undefined;
  onCraneChange: (craneId: string) => void;
}

export const CraneSelector: React.FC<CraneSelectorProps> = ({ craneId, onCraneChange }) => {
  // Fetch crane costs
  const { data: craneCosts, isLoading } = useQuery({
    queryKey: ["crane-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crane_costs")
        .select("*")
        .order("display_order");
      
      if (error) {
        console.error("Error fetching crane costs:", error);
        return [];
      }
      
      return data as CraneCost[];
    }
  });

  // Find default Franna crane for comparison
  const defaultCrane = craneCosts?.find(crane => 
    crane.name === "Franna Crane-S20T-L1"
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Crane Selection</CardTitle>
          <Construction className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="crane">Select Crane Type</Label>
                <Select 
                  value={craneId || "default"} 
                  onValueChange={onCraneChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crane type" />
                  </SelectTrigger>
                  <SelectContent>
                    {!craneCosts || craneCosts.length === 0 ? (
                      <SelectItem value="no-options" disabled>
                        No crane options available
                      </SelectItem>
                    ) : (
                      <>
                        <SelectItem value="default" disabled>
                          Select crane type
                        </SelectItem>
                        {craneCosts.map(crane => (
                          <SelectItem key={crane.id} value={crane.id}>
                            {crane.name} - ${crane.price.toFixed(2)}
                            {crane.name === "Franna Crane-S20T-L1" && " (Default)"}
                          </SelectItem>
                        ))}
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              {defaultCrane && craneId && defaultCrane.id !== craneId && craneCosts && (
                <div className="text-sm text-muted-foreground">
                  <p>Additional cost: ${(
                    (craneCosts.find(c => c.id === craneId)?.price || 0) - (defaultCrane.price || 0)
                  ).toFixed(2)}</p>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                The standard Franna crane is included in the base pool price. 
                Select a different crane only if the site requires it.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
