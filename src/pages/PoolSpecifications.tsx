
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PoolForm } from "@/components/pools/PoolForm";
import { PoolTableRow } from "@/components/pools/PoolTable";
import { PoolColumnGroups, columnGroups } from "@/components/pools/PoolColumnGroups";
import type { Pool, PoolFormValues } from "@/types/pool";

const PoolSpecifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPool, setEditingPool] = useState<Pool | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["basic-info", "dimensions", "volume-info", "pricing"]);
  const queryClient = useQueryClient();

  const { data: pools, isLoading: poolsLoading } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select(`
          *,
          pool_type:pool_types(id, name)
        `);

      if (error) throw error;
      return data as Pool[];
    },
  });

  const { data: poolTypes, isLoading: poolTypesLoading } = useQuery({
    queryKey: ["pool-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_types")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: PoolFormValues) => {
      const { error } = await supabase
        .from("pool_specifications")
        .insert([values]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      setIsOpen(false);
      toast.success("Pool specification created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create pool specification");
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: PoolFormValues) => {
      const { error } = await supabase
        .from("pool_specifications")
        .update(values)
        .eq("id", editingPool?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      setIsOpen(false);
      setEditingPool(null);
      toast.success("Pool specification updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update pool specification");
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pool_specifications")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Pool specification deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete pool specification");
      console.error(error);
    },
  });

  const handleSubmit = (values: PoolFormValues) => {
    if (editingPool) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const handleEdit = (pool: Pool) => {
    setEditingPool(pool);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this pool specification?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(value);
  };

  const isColumnVisible = (column: string) => {
    const group = columnGroups.find(g => g.columns.includes(column));
    return group ? expandedGroups.includes(group.id) : true;
  };

  if (poolsLoading || poolTypesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pool Specifications</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingPool(null);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Pool
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPool ? "Edit Pool Specification" : "Add New Pool Specification"}
                </DialogTitle>
              </DialogHeader>
              <PoolForm
                onSubmit={handleSubmit}
                poolTypes={poolTypes || []}
                defaultValues={editingPool || undefined}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <PoolColumnGroups
              expandedGroups={expandedGroups}
              setExpandedGroups={setExpandedGroups}
            />
            <div className="relative">
              <ScrollArea className="h-[800px] overflow-x-auto">
                <div className="min-w-[1800px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {columnGroups.flatMap(group => 
                          group.columns.map(column => 
                            isColumnVisible(column) ? (
                              <TableHead key={column}>{column}</TableHead>
                            ) : null
                          )
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pools?.map((pool) => (
                        <PoolTableRow
                          key={pool.id}
                          pool={pool}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          isColumnVisible={isColumnVisible}
                          formatCurrency={formatCurrency}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoolSpecifications;
