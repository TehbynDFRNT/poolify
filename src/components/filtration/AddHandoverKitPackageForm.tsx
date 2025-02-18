
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { FiltrationComponent } from "@/types/filtration";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface FormValues {
  components: { componentId: string; quantity: number }[];
}

interface AddHandoverKitPackageFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableComponents: FiltrationComponent[];
}

export function AddHandoverKitPackageForm({
  open,
  onOpenChange,
  availableComponents,
}: AddHandoverKitPackageFormProps) {
  const [selectedComponents, setSelectedComponents] = useState<{ componentId: string; quantity: number }[]>([]);
  const queryClient = useQueryClient();

  // Query to get the next package number
  const { data: nextPackageNumber } = useQuery({
    queryKey: ["handover-kit-packages-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("handover_kit_packages")
        .select("*", { count: 'exact', head: true });

      if (error) throw error;
      return (count || 0) + 1;
    },
  });

  const form = useForm<FormValues>({
    defaultValues: {
      components: [],
    },
  });

  const handleAddComponent = (componentId: string) => {
    setSelectedComponents([...selectedComponents, { componentId, quantity: 1 }]);
  };

  const handleRemoveComponent = (componentId: string) => {
    setSelectedComponents(selectedComponents.filter(c => c.componentId !== componentId));
  };

  const handleUpdateQuantity = (componentId: string, quantity: number) => {
    setSelectedComponents(
      selectedComponents.map(c => 
        c.componentId === componentId ? { ...c, quantity } : c
      )
    );
  };

  const onSubmit = async () => {
    try {
      // Insert the package
      const { data: packageData, error: packageError } = await supabase
        .from("handover_kit_packages")
        .insert({
          name: `Handover Kit ${nextPackageNumber}`,
          display_order: nextPackageNumber,
        })
        .select()
        .single();

      if (packageError) throw packageError;

      // Insert all components
      const { error: componentsError } = await supabase
        .from("handover_kit_package_components")
        .insert(
          selectedComponents.map(comp => ({
            package_id: packageData.id,
            component_id: comp.componentId,
            quantity: comp.quantity,
          }))
        );

      if (componentsError) throw componentsError;

      toast.success("Handover kit package created successfully");
      queryClient.invalidateQueries({ queryKey: ["handover-kit-packages"] });
      queryClient.invalidateQueries({ queryKey: ["handover-kit-packages-count"] });
      onOpenChange(false);
      setSelectedComponents([]);
    } catch (error) {
      console.error("Error creating handover kit package:", error);
      toast.error("Failed to create handover kit package");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Handover Kit Package</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-[400px] p-4 border rounded-md">
              <div className="space-y-4">
                {availableComponents.map((component) => {
                  const selected = selectedComponents.find(c => c.componentId === component.id);
                  return (
                    <div key={component.id} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                      <div>
                        <p className="font-medium">{component.name}</p>
                        <p className="text-sm text-muted-foreground">{component.model_number}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {selected ? (
                          <>
                            <Input
                              type="number"
                              min={1}
                              value={selected.quantity}
                              onChange={(e) => handleUpdateQuantity(component.id, parseInt(e.target.value))}
                              className="w-20"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => handleRemoveComponent(component.id)}
                            >
                              Remove
                            </Button>
                          </>
                        ) : (
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleAddComponent(component.id)}
                          >
                            Add
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={selectedComponents.length === 0}
              >
                Create Package
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
