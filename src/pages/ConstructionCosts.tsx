
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Plus } from "lucide-react";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import type { PoolExcavationType } from "@/types/pool-excavation-type";
import { formatCurrency } from "@/utils/format";

const ConstructionCosts = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDigType, setEditingDigType] = useState<ExcavationDigType | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: digTypes, isLoading: isLoadingDigTypes } = useQuery({
    queryKey: ["excavation-dig-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excavation_dig_types")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as ExcavationDigType[];
    },
  });

  const { data: poolDigTypes, isLoading: isLoadingPools } = useQuery({
    queryKey: ["pool-excavation-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_excavation_types")
        .select(`
          *,
          dig_type:excavation_dig_types(name)
        `)
        .order("range")
        .order("name");
      
      if (error) throw error;
      return data as PoolExcavationType[];
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const digTypeData = {
      name: formData.get("name") as string,
      truck_count: parseInt(formData.get("truck_count") as string),
      truck_hourly_rate: parseFloat(formData.get("truck_hourly_rate") as string),
      truck_hours: parseInt(formData.get("truck_hours") as string),
      excavation_hourly_rate: parseFloat(formData.get("excavation_hourly_rate") as string),
      excavation_hours: parseInt(formData.get("excavation_hours") as string),
    };

    try {
      if (editingDigType) {
        const { error } = await supabase
          .from("excavation_dig_types")
          .update(digTypeData)
          .eq("id", editingDigType.id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Dig type updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("excavation_dig_types")
          .insert([digTypeData]);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Dig type created successfully",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["excavation-dig-types"] });
      setIsDialogOpen(false);
      setEditingDigType(null);
      form.reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const calculateTotalCost = (digType: ExcavationDigType) => {
    const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
    const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
    return truckCost + excavationCost;
  };

  const handleEdit = (digType: ExcavationDigType) => {
    setEditingDigType(digType);
    setIsDialogOpen(true);
  };

  if (isLoadingDigTypes || isLoadingPools) {
    return <div>Loading...</div>;
  }

  // Group pools by range
  const poolsByRange = poolDigTypes?.reduce((acc, pool) => {
    if (!acc[pool.range]) {
      acc[pool.range] = [];
    }
    acc[pool.range].push(pool);
    return acc;
  }, {} as Record<string, PoolExcavationType[]>);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dig Types</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => setEditingDigType(null)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Dig Type
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingDigType ? "Edit Dig Type" : "Add New Dig Type"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    required
                    defaultValue={editingDigType?.name}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="truck_count" className="text-sm font-medium">
                      Truck Count (1-10)
                    </label>
                    <Input
                      id="truck_count"
                      name="truck_count"
                      type="number"
                      min="1"
                      max="10"
                      required
                      defaultValue={editingDigType?.truck_count}
                    />
                  </div>
                  <div>
                    <label htmlFor="truck_hourly_rate" className="text-sm font-medium">
                      Truck Rate ($/hr)
                    </label>
                    <Input
                      id="truck_hourly_rate"
                      name="truck_hourly_rate"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      defaultValue={editingDigType?.truck_hourly_rate}
                    />
                  </div>
                  <div>
                    <label htmlFor="truck_hours" className="text-sm font-medium">
                      Truck Hours (1-24)
                    </label>
                    <Input
                      id="truck_hours"
                      name="truck_hours"
                      type="number"
                      min="1"
                      max="24"
                      required
                      defaultValue={editingDigType?.truck_hours}
                    />
                  </div>
                  <div>
                    <label htmlFor="excavation_hourly_rate" className="text-sm font-medium">
                      Excavation Rate ($/hr)
                    </label>
                    <Input
                      id="excavation_hourly_rate"
                      name="excavation_hourly_rate"
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      defaultValue={editingDigType?.excavation_hourly_rate}
                    />
                  </div>
                  <div>
                    <label htmlFor="excavation_hours" className="text-sm font-medium">
                      Excavation Hours (1-24)
                    </label>
                    <Input
                      id="excavation_hours"
                      name="excavation_hours"
                      type="number"
                      min="1"
                      max="24"
                      required
                      defaultValue={editingDigType?.excavation_hours}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingDigType ? "Update" : "Create"} Dig Type
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dig Type</TableHead>
                <TableHead>Truck Count</TableHead>
                <TableHead>Truck Rate</TableHead>
                <TableHead>Truck Hours</TableHead>
                <TableHead>Excavation Rate</TableHead>
                <TableHead>Excavation Hours</TableHead>
                <TableHead>Total Cost</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {digTypes?.map((digType) => (
                <TableRow key={digType.id}>
                  <TableCell className="font-medium">{digType.name}</TableCell>
                  <TableCell>{digType.truck_count}</TableCell>
                  <TableCell>{formatCurrency(digType.truck_hourly_rate)}</TableCell>
                  <TableCell>{digType.truck_hours}</TableCell>
                  <TableCell>{formatCurrency(digType.excavation_hourly_rate)}</TableCell>
                  <TableCell>{digType.excavation_hours}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(calculateTotalCost(digType))}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(digType)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pool Excavation Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {poolsByRange && Object.entries(poolsByRange).map(([range, pools]) => (
              <div key={range} className="space-y-4">
                <h3 className="text-lg font-semibold">{range}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pool Name</TableHead>
                      <TableHead>Dig Type</TableHead>
                      <TableHead>Total Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pools.map((pool) => {
                      const digType = digTypes?.find(dt => dt.id === pool.dig_type_id);
                      return (
                        <TableRow key={pool.id}>
                          <TableCell>{pool.name}</TableCell>
                          <TableCell>{pool.dig_type?.name}</TableCell>
                          <TableCell className="font-semibold">
                            {digType ? formatCurrency(calculateTotalCost(digType)) : 'N/A'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConstructionCosts;
