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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import type { FiltrationComponent, HandoverKitPackage } from "@/types/filtration";
import { toast } from "sonner";

interface FormValues {
  light_id: string;
  pump_id: string;
  sanitiser_id: string;
  filter_id: string;
  handover_kit_id: string;
}

interface AddFiltrationPackageFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFiltrationPackageForm({
  open,
  onOpenChange,
}: AddFiltrationPackageFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>();

  const { data: nextPackageNumber } = useQuery({
    queryKey: ["filtration-packages-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("filtration_packages")
        .select("*", { count: 'exact', head: true });

      if (error) throw error;
      return (count || 0) + 1;
    },
  });

  const { data: components } = useQuery({
    queryKey: ["filtration-components-by-type"],
    queryFn: async () => {
      // First get the component types
      const { data: types, error: typesError } = await supabase
        .from("filtration_component_types")
        .select("*");

      if (typesError) throw typesError;
      console.log("Component types:", types); // Debug log

      // Then get the components with their types
      const { data: components, error: componentsError } = await supabase
        .from("filtration_components")
        .select(`
          *,
          filtration_component_types (
            name
          )
        `)
        .order("name");

      if (componentsError) throw componentsError;
      console.log("Components with types:", components); // Debug log

      // Group components by type
      const groupedComponents = types.reduce((acc, type) => {
        // Convert type names to match the expected keys
        const key = type.name.toLowerCase().replace(/\s+/g, '_');
        acc[key] = components.filter(c => c.type_id === type.id);
        console.log(`Components for type ${key}:`, acc[key]); // Debug log
        return acc;
      }, {} as Record<string, FiltrationComponent[]>);

      console.log("Final grouped components:", groupedComponents); // Debug log
      return groupedComponents;
    },
  });

  const { data: handoverKits } = useQuery({
    queryKey: ["handover-kit-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("handover_kit_packages")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as HandoverKitPackage[];
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase.from("filtration_packages").insert([
        {
          name: `Option ${nextPackageNumber}`,
          display_order: nextPackageNumber,
          ...values,
        },
      ]);

      if (error) throw error;

      toast.success("Filtration package created successfully");
      queryClient.invalidateQueries({ queryKey: ["filtration-packages"] });
      queryClient.invalidateQueries({ queryKey: ["filtration-packages-count"] });
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error creating filtration package:", error);
      toast.error("Failed to create filtration package");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Filtration Package</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="light_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Light</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a light" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {components?.lights?.map((component) => (
                        <SelectItem key={component.id} value={component.id}>
                          {component.name} ({component.model_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pump_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pool Pump</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a pump" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {components?.pool_pump?.map((component) => (
                        <SelectItem key={component.id} value={component.id}>
                          {component.name} ({component.model_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sanitiser_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sanitiser</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sanitiser" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {components?.sanitiser?.map((component) => (
                        <SelectItem key={component.id} value={component.id}>
                          {component.name} ({component.model_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="filter_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filter</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a filter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {components?.pool_filter?.map((component) => (
                        <SelectItem key={component.id} value={component.id}>
                          {component.name} ({component.model_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="handover_kit_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Handover Kit Package</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a handover kit package" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {handoverKits?.map((kit) => (
                        <SelectItem key={kit.id} value={kit.id}>
                          {kit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Create Package
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
