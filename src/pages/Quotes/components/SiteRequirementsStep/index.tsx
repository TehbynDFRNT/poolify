
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Construction, AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CraneCost } from "@/types/crane-cost";
import { TrafficControlCost } from "@/types/traffic-control-cost";
import { Skeleton } from "@/components/ui/skeleton";

interface SiteRequirementsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SiteRequirementsStep = ({ onNext, onPrevious }: SiteRequirementsStepProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [siteRequirementsCost, setSiteRequirementsCost] = useState<number>(0);

  // Fetch crane costs
  const { data: craneCosts, isLoading: isLoadingCranes } = useQuery({
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

  // Fetch traffic control costs
  const { data: trafficControlCosts, isLoading: isLoadingTraffic } = useQuery({
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

  // Find default Franna crane for comparison
  const defaultCrane = craneCosts?.find(crane => 
    crane.name === "Franna Crane-S20T-L1"
  );

  // Calculate additional cost if a non-default crane is selected
  useEffect(() => {
    let totalCost = 0;
    
    // Calculate crane cost difference if not using default
    if (quoteData.crane_id && defaultCrane && craneCosts) {
      const selectedCrane = craneCosts.find(crane => crane.id === quoteData.crane_id);
      if (selectedCrane && selectedCrane.id !== defaultCrane.id) {
        // Only add the difference in cost between selected crane and default
        totalCost += selectedCrane.price - defaultCrane.price;
      }
    }
    
    // Add traffic control cost if selected
    if (quoteData.traffic_control_id && trafficControlCosts) {
      const selectedTrafficControl = trafficControlCosts.find(
        tc => tc.id === quoteData.traffic_control_id
      );
      if (selectedTrafficControl) {
        totalCost += selectedTrafficControl.price;
      }
    }
    
    setSiteRequirementsCost(totalCost);
    
    // Update quote data with the site requirements cost
    updateQuoteData({ 
      site_requirements_cost: totalCost 
    });
  }, [quoteData.crane_id, quoteData.traffic_control_id, craneCosts, trafficControlCosts, defaultCrane, updateQuoteData]);

  // Show warning but don't block progress if no pool is selected
  useEffect(() => {
    if (!quoteData.pool_id) {
      toast.warning("No pool selected. You can continue, but the quote will be incomplete.");
    }
  }, [quoteData.pool_id]);

  const handleCraneChange = (craneId: string) => {
    updateQuoteData({ crane_id: craneId });
  };

  const handleTrafficControlChange = (trafficControlId: string) => {
    updateQuoteData({ traffic_control_id: trafficControlId });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Configure the required site modifications for installing this pool (non-optional items needed for installation).
      </p>
      
      {!quoteData.pool_id && (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="flex items-start p-4 gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-800">
                No pool has been selected. Site requirements are specific to the pool model.
                You can continue, but you may need to adjust these settings later.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crane Selection */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Crane Selection</CardTitle>
              <Construction className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingCranes ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="crane">Select Crane Type</Label>
                    <Select 
                      value={quoteData.crane_id || ""} 
                      onValueChange={handleCraneChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select crane type" />
                      </SelectTrigger>
                      <SelectContent>
                        {craneCosts?.map(crane => (
                          <SelectItem key={crane.id} value={crane.id}>
                            {crane.name} - ${crane.price.toFixed(2)}
                            {crane.name === "Franna Crane-S20T-L1" && " (Default)"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {defaultCrane && quoteData.crane_id && defaultCrane.id !== quoteData.crane_id && (
                    <div className="text-sm text-muted-foreground">
                      <p>Additional cost: ${(
                        craneCosts?.find(c => c.id === quoteData.crane_id)?.price - defaultCrane.price
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

        {/* Traffic Control */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Traffic Control</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTraffic ? (
              <Skeleton className="h-9 w-full" />
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="traffic-control">Traffic Control Level</Label>
                  <Select 
                    value={quoteData.traffic_control_id || "none"} 
                    onValueChange={handleTrafficControlChange}
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
                
                {quoteData.traffic_control_id && quoteData.traffic_control_id !== "none" && (
                  <div className="text-sm text-muted-foreground">
                    <p>Cost: ${trafficControlCosts?.find(tc => tc.id === quoteData.traffic_control_id)?.price.toFixed(2)}</p>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Traffic control may be required if the installation site is on a busy road or requires permits.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cost Summary */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex justify-between text-sm font-medium">
            <span>Additional Site Requirements Cost:</span>
            <span>${siteRequirementsCost.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
        >
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};
