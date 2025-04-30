
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { HeatPumpCompatibility } from "@/hooks/useHeatPumpCompatibility";
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  heat_pump_id: z.string().uuid(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditHeatPumpCompatibilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: HeatPumpCompatibility | null;
  heatPumpProducts: HeatPumpProduct[];
  onSave: (id: string, updates: { heat_pump_id: string, hp_sku: string, hp_description: string }) => Promise<any>;
}

export const EditHeatPumpCompatibilityModal: React.FC<EditHeatPumpCompatibilityModalProps> = ({
  open,
  onOpenChange,
  record,
  heatPumpProducts,
  onSave,
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      heat_pump_id: record?.heat_pump_id || "",
    },
  });

  // Update form when record changes
  useEffect(() => {
    if (record) {
      form.reset({
        heat_pump_id: record.heat_pump_id || "",
      });
    }
  }, [record, form]);

  const handleSave = async (values: FormValues) => {
    if (!record) return;
    
    setIsSaving(true);
    try {
      // Find the selected heat pump product to get its SKU and description
      const selectedProduct = heatPumpProducts.find(
        (product) => product.id === values.heat_pump_id
      );

      if (!selectedProduct) {
        throw new Error("Selected heat pump product not found");
      }

      await onSave(record.id, {
        heat_pump_id: values.heat_pump_id,
        hp_sku: selectedProduct.hp_sku,
        hp_description: selectedProduct.hp_description,
      });

      toast({
        title: "Compatibility updated",
        description: "Heat pump compatibility has been updated successfully.",
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error updating compatibility",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Heat Pump Compatibility</DialogTitle>
          <DialogDescription>
            Update the heat pump for {record?.pool_range} - {record?.pool_model}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="heat_pump_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heat Pump</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSaving}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a heat pump" />
                      </SelectTrigger>
                      <SelectContent>
                        {heatPumpProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.hp_sku} - {product.hp_description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
