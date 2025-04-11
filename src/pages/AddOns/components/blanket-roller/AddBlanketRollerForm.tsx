
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BlanketRoller, calculateMarginValue } from "@/types/blanket-roller";
import { useBlanketRollers } from "@/hooks/useBlanketRollers";

const formSchema = z.object({
  pool_range: z.string().min(1, "Pool range is required"),
  pool_model: z.string().min(1, "Pool model is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().min(1, "Description is required"),
  rrp: z.coerce.number().min(0, "RRP must be a positive number"),
  trade: z.coerce.number().min(0, "Trade must be a positive number"),
  margin: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddBlanketRollerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: BlanketRoller | null;
  isEditMode?: boolean;
}

export const AddBlanketRollerForm: React.FC<AddBlanketRollerFormProps> = ({
  open,
  onOpenChange,
  initialValues = null,
  isEditMode = false,
}) => {
  const { addBlanketRoller, updateBlanketRoller } = useBlanketRollers();

  const defaultValues: FormValues = {
    pool_range: initialValues?.pool_range || "",
    pool_model: initialValues?.pool_model || "",
    sku: initialValues?.sku || "",
    description: initialValues?.description || "",
    rrp: initialValues?.rrp || 0,
    trade: initialValues?.trade || 0,
    margin: initialValues?.margin || 0,
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    // Ensure all required fields are present
    const completeData = {
      pool_range: data.pool_range,
      pool_model: data.pool_model,
      sku: data.sku,
      description: data.description,
      rrp: data.rrp,
      trade: data.trade,
      margin: data.margin || calculateMarginValue(data.rrp, data.trade)
    };
    
    try {
      if (isEditMode && initialValues) {
        await updateBlanketRoller({ id: initialValues.id, updates: completeData });
      } else {
        await addBlanketRoller(completeData);
      }
      onOpenChange(false);
      form.reset(defaultValues);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("There was an error saving the blanket & roller");
    }
  };

  // Recalculate margin when RRP or Trade changes
  React.useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (name === "rrp" || name === "trade") {
        const rrp = form.getValues("rrp") || 0;
        const trade = form.getValues("trade") || 0;
        form.setValue("margin", calculateMarginValue(rrp, trade));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Blanket & Roller" : "Add Blanket & Roller"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pool_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pool Range</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Piazza" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pool_model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pool Model</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Alto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., IX-ALTO-BR" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 3mm Daisy Thermal Blanket..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="rrp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RRP</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trade</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
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
                        min="0"
                        step="0.01"
                        readOnly
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditMode ? "Update" : "Add"} Blanket & Roller
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
