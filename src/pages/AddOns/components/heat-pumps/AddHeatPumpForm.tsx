
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Button } from "@/components/ui/button";

interface AddHeatPumpFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<HeatPumpProduct, "id" | "created_at">) => void;
  initialValues?: HeatPumpProduct | null;
  isEditMode?: boolean;
}

// Form validation schema
const formSchema = z.object({
  hp_sku: z.string().min(2, "SKU is required"),
  hp_description: z.string().min(2, "Description is required"),
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
  rrp: z.coerce.number().min(0, "RRP must be a positive number"),
  margin: z.coerce.number(),
});

type FormValues = z.infer<typeof formSchema>;

export const AddHeatPumpForm: React.FC<AddHeatPumpFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues = null,
  isEditMode = false,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues ? {
      hp_sku: initialValues.hp_sku,
      hp_description: initialValues.hp_description,
      cost: initialValues.cost,
      rrp: initialValues.rrp,
      margin: initialValues.margin,
    } : {
      hp_sku: "",
      hp_description: "",
      cost: 0,
      rrp: 0,
      margin: 0,
    },
  });

  // Calculate margin when cost or rrp changes
  React.useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === "cost" || name === "rrp") {
        const cost = parseFloat(values.cost?.toString() || "0");
        const rrp = parseFloat(values.rrp?.toString() || "0");
        
        if (!isNaN(cost) && !isNaN(rrp) && rrp >= cost) {
          const calculatedMargin = rrp - cost;
          form.setValue("margin", calculatedMargin);
        }
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
    onOpenChange(false);
    form.reset();
  };

  // Reset form when dialog closes or when initialValues change
  React.useEffect(() => {
    if (!open) {
      // Short delay to let the dialog close animation finish
      const timeout = setTimeout(() => {
        form.reset(
          initialValues ? {
            hp_sku: initialValues.hp_sku,
            hp_description: initialValues.hp_description,
            cost: initialValues.cost,
            rrp: initialValues.rrp,
            margin: initialValues.margin,
          } : {
            hp_sku: "",
            hp_description: "",
            cost: 0,
            rrp: 0,
            margin: 0,
          }
        );
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [open, initialValues, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Heat Pump" : "Add New Heat Pump"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="hp_sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., IX9" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="hp_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Sunlover Oasis 9kW Heat Pump" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
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
                      <Input type="number" step="0.01" {...field} />
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
                      <Input type="number" step="0.01" readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? "Update Heat Pump" : "Add Heat Pump"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
