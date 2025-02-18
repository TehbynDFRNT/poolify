
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import type { FiltrationComponent, HandoverKitPackage } from "@/types/filtration";
import { toast } from "sonner";

interface FormValues {
  light_id: string;
  pump_id: string;
  sanitiser_id: string;
  filter_id: string;
  filter_type: 'standard' | 'media';
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
  const [filterType, setFilterType] = useState<'standard' | 'media'>('standard');

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
      const { data: types, error: typesError } = await supabase
        .from("filtration_component_types")
        .select("*");

      if (typesError) throw typesError;

      const { data: components, error: componentsError } = await supabase
        .from("filtration_components")
        .select("*")
        .order("name");

      if (componentsError) throw componentsError;

      return types.reduce((acc, type) => {
        acc[type.name.toLowerCase().replace(/\s+/g, '_')] = 
          components.filter(c => c.type_id === type.id);
        return acc;
      }, {} as Record<string, FiltrationComponent[]>);
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
      const { error } = await supabase
        .from("filtration_packages")
        .insert({
          name: `Option ${nextPackageNumber}`,
          display_order: nextPackageNumber,
          ...values,
        });

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
                      {components?.light?.map((component) => (
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
              name="filter_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filter Type</FormLabel>
                  <RadioGroup
                    onValueChange={value => {
                      field.onChange(value);
                      setFilterType(value as 'standard' | 'media');
                    }}
                    defaultValue="standard"
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="standard" id="standard" />
                      <label htmlFor="standard">Standard Filter</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="media" id="media" />
                      <label htmlFor="media">Media Filter</label>
                    </div>
                  </RadioGroup>
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
                      {(filterType === 'standard' ? components?.standard_filter : components?.media_filter)?.map((component) => (
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
