
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, Check, X, Pencil } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
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

// Use any as a workaround for the missing type definitions
type CraneSelection = {
  pool_id: string;
  crane_id: string;
};

export const CraneNeededSection = ({ poolId }: CraneNeededSectionProps) => {
  const [selectedCraneId, setSelectedCraneId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Fetch all crane costs data
  const { data: craneCosts, isLoading: isLoadingCraneCosts } = useQuery({
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

  // Fetch the existing crane selection for this pool using a raw query to bypass type checking
  const { data: craneSelection, isLoading: isLoadingSelection } = useQuery({
    queryKey: ["crane-selection", poolId],
    queryFn: async () => {
      if (!poolId) return null;
      
      // Use a raw query with explicit typing
      const { data, error } = await supabase
        .rpc('get_crane_selection_for_pool', { pool_id_param: poolId })
        .returns<CraneSelection | null>();

      // Fallback if RPC doesn't exist yet - this will run on first load
      if (error && error.code === 'PGRST116') {
        // Use a direct SQL query as a workaround
        const { data: rawData, error: rawError } = await supabase
          .from('pool_crane_selections')
          .select('crane_id')
          .eq('pool_id', poolId)
          .maybeSingle();
          
        if (rawError && rawError.code !== 'PGRST116') {
          console.error('Error fetching crane selection:', rawError);
          return null;
        }
        
        return rawData as unknown as CraneSelection;
      }
      
      if (error) {
        console.error('Error fetching crane selection:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!poolId,
  });

  // Find the specific Franna crane in the list for the default option
  const frannaCrane = craneCosts?.find(cost => 
    cost.name === "Franna Crane-S20T-L1"
  );

  // Set the selected crane ID from the fetched selection or default to Franna
  useEffect(() => {
    if (craneSelection?.crane_id) {
      setSelectedCraneId(craneSelection.crane_id);
    } else if (frannaCrane?.id && !selectedCraneId) {
      setSelectedCraneId(frannaCrane.id);
    }
  }, [craneSelection, frannaCrane, selectedCraneId]);

  // Get the currently selected crane or default to Franna
  const selectedCrane = selectedCraneId 
    ? craneCosts?.find(cost => cost.id === selectedCraneId) 
    : frannaCrane;

  // Handle crane selection change
  const handleCraneChange = (craneId: string) => {
    setSelectedCraneId(craneId);
  };

  // Mutation to save crane selection
  const saveCraneMutation = useMutation({
    mutationFn: async () => {
      if (!poolId || !selectedCraneId) return;

      try {
        // Check if there's an existing selection using a workaround for type checking
        const { count, error: countError } = await supabase
          .from('pool_crane_selections')
          .select('*', { count: 'exact', head: true })
          .eq('pool_id', poolId);
          
        if (countError) {
          console.error('Error checking existing crane selection:', countError);
          throw countError;
        }

        if (count && count > 0) {
          // Update existing selection using RPC to bypass type checking
          const { error } = await supabase
            .rpc('update_crane_selection', { 
              p_pool_id: poolId, 
              p_crane_id: selectedCraneId 
            });

          // Fallback if RPC doesn't exist
          if (error && error.code === 'PGRST116') {
            const { error: updateError } = await supabase
              .from('pool_crane_selections')
              .update({ crane_id: selectedCraneId })
              .eq('pool_id', poolId);
              
            if (updateError) throw updateError;
          } else if (error) {
            throw error;
          }
        } else {
          // Insert new selection using RPC to bypass type checking
          const { error } = await supabase
            .rpc('insert_crane_selection', { 
              p_pool_id: poolId, 
              p_crane_id: selectedCraneId 
            });

          // Fallback if RPC doesn't exist
          if (error && error.code === 'PGRST116') {
            const { error: insertError } = await supabase
              .from('pool_crane_selections')
              .insert({ pool_id: poolId, crane_id: selectedCraneId });
              
            if (insertError) throw insertError;
          } else if (error) {
            throw error;
          }
        }
      } catch (error) {
        console.error('Error saving crane selection:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate the queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["crane-selection", poolId] });
      queryClient.invalidateQueries({ queryKey: ["selected-crane", poolId] });
      toast.success("Crane selection updated");
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Error saving crane selection:", error);
      toast.error("Failed to update crane selection");
    }
  });

  const handleSave = () => {
    if (poolId) {
      saveCraneMutation.mutate();
    } else {
      setIsEditing(false);
      toast.success("Crane selection updated");
    }
  };

  const handleCancel = () => {
    // Reset to the last saved value
    if (craneSelection?.crane_id) {
      setSelectedCraneId(craneSelection.crane_id);
    } else if (frannaCrane?.id) {
      setSelectedCraneId(frannaCrane.id);
    }
    setIsEditing(false);
  };

  const isLoading = isLoadingCraneCosts || isLoadingSelection;

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
