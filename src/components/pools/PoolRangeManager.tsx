
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

interface PoolRange {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export function PoolRangeManager() {
  const queryClient = useQueryClient();
  const [isReordering, setIsReordering] = useState(false);

  const { data: poolRanges } = useQuery({
    queryKey: ["pool-ranges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_ranges")
        .select("*")
        .order("display_order");
      if (error) throw error;
      return data as PoolRange[];
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from("pool_ranges")
        .update({ display_order: newOrder })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-ranges"] });
      toast.success("Range order updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update range order");
      console.error(error);
    },
  });

  const handleMove = async (range: PoolRange, direction: "up" | "down") => {
    if (!poolRanges) return;

    setIsReordering(true);
    const currentIndex = poolRanges.findIndex((r) => r.id === range.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < poolRanges.length) {
      const otherRange = poolRanges[newIndex];
      
      try {
        await updateOrderMutation.mutateAsync({
          id: range.id,
          newOrder: otherRange.display_order,
        });
        await updateOrderMutation.mutateAsync({
          id: otherRange.id,
          newOrder: range.display_order,
        });
      } catch (error) {
        console.error("Failed to reorder ranges:", error);
      }
    }
    setIsReordering(false);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Range Name</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {poolRanges?.map((range, index) => (
            <TableRow key={range.id}>
              <TableCell>{range.name}</TableCell>
              <TableCell>{range.display_order}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMove(range, "up")}
                  disabled={isReordering || index === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMove(range, "down")}
                  disabled={isReordering || index === (poolRanges.length - 1)}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
