
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { DigTypeForm } from "./components/DigTypeForm";
import { DigTypesTable } from "./components/DigTypesTable";
import { PoolExcavationTable } from "./components/PoolExcavationTable";

const Excavation = () => {
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
      return data;
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

  const handleEdit = (digType: ExcavationDigType) => {
    setEditingDigType(digType);
    setIsDialogOpen(true);
  };

  if (isLoadingDigTypes || isLoadingPools) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Excavation Dig Types</CardTitle>
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
              <DigTypeForm 
                onSubmit={handleSubmit}
                editingDigType={editingDigType}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <DigTypesTable 
            digTypes={digTypes ?? []}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pool Excavation Types</CardTitle>
        </CardHeader>
        <CardContent>
          <PoolExcavationTable 
            pools={poolDigTypes ?? []}
            digTypes={digTypes ?? []}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Excavation;
