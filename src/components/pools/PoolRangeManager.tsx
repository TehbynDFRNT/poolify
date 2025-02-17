
import { useState, useEffect } from "react";
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
  const [localRanges, setLocalRanges] = useState<PoolRange[]>([]);
  
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

  // Use useEffect instead of onSuccess
  useEffect(() => {
    if (poolRanges && !localRanges.length) {
      setLocalRanges(poolRanges);
    }
  }, [poolRanges]);

  const updateOrderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from("pool_ranges")
        .update({ display_order: newOrder })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-ranges", "pool-specifications"] });
      toast.success("Range order updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update range order");
      console.error(error);
    },
  });

  const handleMove = (range: PoolRange, direction: "up" | "down") => {
    const currentIndex = localRanges.findIndex((r) => r.id === range.id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex >= 0 && newIndex < localRanges.length) {
      const newRanges = [...localRanges];
      const temp = newRanges[currentIndex];
      newRanges[currentIndex] = newRanges[newIndex];
      newRanges[newIndex] = temp;
      
      // Update display_order values
      newRanges.forEach((r, index) => {
        r.display_order = index + 1;
      });
      
      setLocalRanges(newRanges);
    }
  };

  const handleApply = async () => {
    setIsReordering(true);
    try {
      // Update all ranges with their new orders
      for (const range of localRanges) {
        await updateOrderMutation.mutateAsync({
          id: range.id,
          newOrder: range.display_order,
        });
      }
      toast.success("Pool ranges reordered successfully");
    } catch (error) {
      toast.error("Failed to apply new range order");
      console.error(error);
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="space-y-4">
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
            {localRanges.map((range, index) => (
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
                    disabled={isReordering || index === (localRanges.length - 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end">
        <Button 
          onClick={handleApply}
          disabled={isReordering}
        >
          Apply Order Changes
        </Button>
      </div>
    </div>
  );
}
