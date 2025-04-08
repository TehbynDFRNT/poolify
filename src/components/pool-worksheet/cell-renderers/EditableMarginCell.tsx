
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X, Edit } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMargin } from "@/pages/Quotes/components/SelectPoolStep/hooks/useMargin";

interface EditableMarginCellProps {
  poolId: string;
}

export const EditableMarginCell = ({ poolId }: EditableMarginCellProps) => {
  const { marginData } = useMargin(poolId);
  const [isEditing, setIsEditing] = useState(false);
  const [marginValue, setMarginValue] = useState(marginData?.toString() || "");
  const queryClient = useQueryClient();

  const updateMarginMutation = useMutation({
    mutationFn: async (newMargin: number) => {
      // First check if a margin record exists for this pool
      const { data: existingMargin } = await supabase
        .from("pool_margins")
        .select("id")
        .eq("pool_id", poolId)
        .single();

      if (existingMargin) {
        // Update existing record
        await supabase
          .from("pool_margins")
          .update({ margin_percentage: newMargin })
          .eq("id", existingMargin.id);
      } else {
        // Create new record
        await supabase
          .from("pool_margins")
          .insert({ pool_id: poolId, margin_percentage: newMargin });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-margin", poolId] });
      setIsEditing(false);
      toast.success("Margin updated successfully");
    },
    onError: (error) => {
      console.error("Error updating margin:", error);
      toast.error("Failed to update margin");
    }
  });

  const handleSave = () => {
    const margin = parseFloat(marginValue);
    if (isNaN(margin)) {
      toast.error("Please enter a valid number");
      return;
    }
    updateMarginMutation.mutate(margin);
  };

  const handleCancel = () => {
    setMarginValue(marginData?.toString() || "");
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={marginValue}
          onChange={(e) => setMarginValue(e.target.value)}
          className="w-20"
          autoFocus
          min="0"
          max="100"
          step="0.1"
        />
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleSave}
          disabled={updateMarginMutation.isPending}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleCancel}
          disabled={updateMarginMutation.isPending}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="flex items-center justify-between gap-2 cursor-pointer hover:bg-muted px-2 py-1 rounded group"
      onClick={() => setIsEditing(true)}
    >
      <span>{marginData ? `${marginData}%` : "-"}</span>
      <Edit className="h-4 w-4 opacity-0 group-hover:opacity-100" />
    </div>
  );
};
