
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BobcatCost } from "@/types/bobcat-cost";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BobcatSelectorProps {
  bobcatId: string | undefined;
  onBobcatChange: (bobcatId: string) => void;
}

export const BobcatSelector = ({ bobcatId, onBobcatChange }: BobcatSelectorProps) => {
  // Group bobcat costs by size category for better UI presentation
  const { data: bobcatCosts, isLoading } = useQuery({
    queryKey: ["bobcat-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bobcat_costs")
        .select("*")
        .order("size_category")
        .order("display_order");
      
      if (error) {
        console.error("Error fetching bobcat costs:", error);
        return [];
      }
      
      return data as BobcatCost[];
    }
  });

  // Group bobcat costs by size category
  const groupedBobcatCosts = bobcatCosts?.reduce((acc, cost) => {
    if (!acc[cost.size_category]) {
      acc[cost.size_category] = [];
    }
    acc[cost.size_category].push(cost);
    return acc;
  }, {} as Record<string, BobcatCost[]>);

  // Find the selected bobcat to display its cost
  const selectedBobcat = bobcatId && bobcatId !== "none" 
    ? bobcatCosts?.find(b => b.id === bobcatId) 
    : null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Bobcat Selection</CardTitle>
          <Truck className="h-5 w-5 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-9 w-full" />
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bobcat">Select Bobcat Type</Label>
                <Select 
                  value={bobcatId || "none"} 
                  onValueChange={onBobcatChange}
                >
                  <SelectTrigger id="bobcat-select">
                    <SelectValue placeholder="Select bobcat type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None Required</SelectItem>
                    {groupedBobcatCosts && Object.entries(groupedBobcatCosts).map(([category, costs]) => (
                      <div key={category} className="py-2">
                        <div className="px-2 text-sm font-medium text-gray-500">{category}</div>
                        {costs.map(bobcat => (
                          <SelectItem key={bobcat.id} value={bobcat.id}>
                            {bobcat.day_code} - ${bobcat.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedBobcat && (
                <div className="text-sm text-muted-foreground">
                  <p>Cost: ${selectedBobcat.price.toFixed(2)}</p>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Select a bobcat size and code if this installation requires one. This is optional.
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
