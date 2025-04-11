
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";

const formSchema = z.object({
  hp_sku: z.string().min(1, "SKU is required"),
  hp_description: z.string().min(1, "Description is required"),
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
  margin: z.coerce.number().min(0, "Margin must be a positive number"),
  rrp: z.coerce.number().min(0, "RRP must be a positive number"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddHeatPumpFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => Promise<void>;
  initialValues?: HeatPumpProduct | null;
  isEditMode?: boolean;
}

export const AddHeatPumpForm = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues = null,
  isEditMode = false,
}: AddHeatPumpFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hp_sku: "",
      hp_description: "",
      cost: 0,
      margin: 0,
      rrp: 0,
    },
  });

  // Reset form when dialog opens/closes or when initialValues change
  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.reset({
          hp_sku: initialValues.hp_sku,
          hp_description: initialValues.hp_description,
          cost: initialValues.cost,
          margin: initialValues.margin,
          rrp: initialValues.rrp,
        });
      } else {
        form.reset({
          hp_sku: "",
          hp_description: "",
          cost: 0,
          margin: 0,
          rrp: 0,
        });
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = async (values: FormValues) => {
    try {
      await onSubmit(values);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Heat Pump Product" : "Add New Heat Pump Product"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="hp_sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isEditMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hp_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="margin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margin</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rrp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RRP</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="mt-4">
                {isEditMode ? "Update" : "Add"} Heat Pump
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
