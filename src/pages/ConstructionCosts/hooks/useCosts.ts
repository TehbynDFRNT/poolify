
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { CraneCost } from "@/types/crane-cost";
import type { TrafficControlCost } from "@/types/traffic-control-cost";
import type { FixedCost } from "@/types/fixed-cost";

type TableNames = "crane_costs" | "traffic_control_costs" | "fixed_costs";
type CostType = CraneCost | TrafficControlCost | FixedCost;

export const useCosts = (tableName: TableNames, queryKey: string) => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: costs, isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("display_order");

      if (error) {
        throw error;
      }

      return data as CostType[];
    },
  });

  const startEditing = (cost: CostType) => {
    setEditingId(cost.id);
    setEditingPrice(cost.price.toString());
  };

  const handleSave = async (cost: CostType) => {
    try {
      const newPrice = parseFloat(editingPrice);
      if (isNaN(newPrice)) {
        toast.error("Please enter a valid price");
        return;
      }

      const { error } = await supabase
        .from(tableName)
        .update({ price: newPrice })
        .eq("id", cost.id);

      if (error) throw error;

      toast.success("Price updated successfully");
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    } catch (error) {
      toast.error("Failed to update price");
      console.error("Error updating price:", error);
    } finally {
      setEditingId(null);
      setEditingPrice("");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingPrice("");
  };

  return {
    costs,
    isLoading,
    editingId,
    editingPrice,
    isAdding,
    setIsAdding,
    startEditing,
    handleSave,
    handleCancel,
    setEditingPrice,
  };
};
