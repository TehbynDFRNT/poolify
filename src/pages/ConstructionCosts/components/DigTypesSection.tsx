
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import type { DigType } from "@/types/excavation-dig-type";
import { DigTypeForm } from "./DigTypeForm";
import { DigTypesTable } from "./DigTypesTable";

interface DigTypesSectionProps {
  digTypes: DigType[];
}

export const DigTypesSection = ({ digTypes }: DigTypesSectionProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDigType, setEditingDigType] = useState<DigType | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const digTypeData = {
      name: formData.get("name") as string,
      cost: parseFloat(formData.get("cost") as string),
    };

    try {
      if (editingDigType) {
        const { error } = await supabase
          .from("dig_types")
          .update(digTypeData)
          .eq("id", editingDigType.id);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Dig type updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("dig_types")
          .insert([digTypeData]);
        
        if (error) throw error;
        toast({
          title: "Success",
          description: "Dig type created successfully",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["dig-types"] });
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

  const handleEdit = (digType: DigType) => {
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
        />
      </div>
    </>
  );
};
