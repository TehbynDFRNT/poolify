
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { DigTypeForm } from "./DigTypeForm";
import { DigTypesTable } from "./DigTypesTable";

interface DigTypesSectionProps {
  digTypes: ExcavationDigType[];
}

export const DigTypesSection = ({ digTypes }: DigTypesSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDigType, setEditingDigType] = useState<ExcavationDigType | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const calculateTotalCost = (digType: ExcavationDigType) => {
    const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
    const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
    return truckCost + excavationCost;
  };

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

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Dig Types</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => setEditingDigType(null)}
              className="flex items-center gap-2 bg-[#9FC8C0] hover:bg-[#8AB3AB] text-white"
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
            <DigTypeForm 
              onSubmit={handleSubmit}
              editingDigType={editingDigType}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg border shadow-sm overflow-hidden mb-8">
        <DigTypesTable
          digTypes={digTypes}
          onEdit={handleEdit}
          calculateTotalCost={calculateTotalCost}
        />
      </div>
    </>
  );
};
