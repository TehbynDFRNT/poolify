import { useEffect } from "react";
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
import type { FiltrationComponent, HandoverKitPackage, PackageWithComponents } from "@/types/filtration";
import { toast } from "sonner";

interface FormValues {
  light_id: string;
  pump_id: string;
  sanitiser_id: string;
  filter_id: string;
  filter_type: 'standard' | 'media';
  handover_kit_id: string;
}

interface EditFiltrationPackageFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  package: PackageWithComponents;
}

export function EditFiltrationPackageForm({
  open,
  onOpenChange,
  package: pkg,
}: EditFiltrationPackageFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<FormValues>();

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

  useEffect(() => {
    if (pkg) {
      form.reset({
        light_id: pkg.light?.id || '',
        pump_id: pkg.pump?.id || '',
        sanitiser_id: pkg.sanitiser?.id || '',
        filter_id: pkg.filter?.id || '',
        filter_type: pkg.filter_type || 'standard',
        handover_kit_id: pkg.handover_kit?.id || '',
      });
    }
  }, [pkg, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase
        .from("filtration_packages")
        .update(values)
        .eq("id", pkg.id);

      if (error) throw error;

      toast.success("Filtration package updated successfully");
      queryClient.invalidateQueries({ queryKey: ["filtration-packages"] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating filtration package:", error);
      toast.error("Failed to update filtration package");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {pkg.name}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="light_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Light</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a filter" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(form.watch('filter_type') === 'standard' ? components?.standard_filter : components?.media_filter)?.map((component) => (
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
