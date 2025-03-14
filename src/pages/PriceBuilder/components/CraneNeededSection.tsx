
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, Check, X, Pencil } from "lucide-react";
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
import { Button } from "@/components/ui/button";

interface CraneNeededSectionProps {
  poolId?: string;
}

export const CraneNeededSection = ({ poolId }: CraneNeededSectionProps) => {
  const [selectedCraneId, setSelectedCraneId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Crane selection updated");
  };

  const handleCancel = () => {
    setIsEditing(false);
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
          <div>
            {isEditing ? (
              <div className="flex items-center space-x-2">
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
                <Button size="sm" variant="ghost" onClick={handleSave}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div 
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted/70 cursor-pointer group"
                onClick={() => setIsEditing(true)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {selectedCrane?.name || "Crane"}
                  </span>
                  {selectedCrane?.name === "Franna Crane-S20T-L1" && (
                    <Badge variant="outline" className="text-primary border-primary">Default</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    ${selectedCrane?.price.toFixed(2) || "N/A"}
                  </span>
                  <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100 text-muted-foreground" />
                </div>
              </div>
            )}
            
            <p className="text-sm text-muted-foreground mt-2">
              {selectedCrane?.name === "Franna Crane-S20T-L1" 
                ? "The default crane will be used for installation unless specified otherwise."
                : "A non-default crane has been selected for this project."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
