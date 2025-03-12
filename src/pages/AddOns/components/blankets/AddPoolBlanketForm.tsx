
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePoolBlankets } from "@/hooks/usePoolBlankets";
import type { PoolBlanket } from "@/types/pool-blanket";

interface AddPoolBlanketFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddPoolBlanketForm = ({ open, onOpenChange }: AddPoolBlanketFormProps) => {
  const { addPoolBlanket } = usePoolBlankets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Omit<PoolBlanket, 'id' | 'created_at'>>({
    defaultValues: {
      pool_range: "",
      pool_model: "",
      blanket_sku: "",
      blanket_description: "",
      blanket_rrp: 0,
      blanket_trade: 0,
      blanket_margin: 0,
      heatpump_sku: "",
      heatpump_description: "",
      heatpump_rrp: 0,
      heatpump_trade: 0,
      heatpump_margin: 0
    }
  });

  const onSubmit = async (data: Omit<PoolBlanket, 'id' | 'created_at'>) => {
    setIsSubmitting(true);
    try {
      // Convert numeric strings to numbers
      const formattedData = {
        ...data,
        blanket_rrp: Number(data.blanket_rrp),
        blanket_trade: Number(data.blanket_trade),
        blanket_margin: Number(data.blanket_margin),
        heatpump_rrp: Number(data.heatpump_rrp),
        heatpump_trade: Number(data.heatpump_trade),
        heatpump_margin: Number(data.heatpump_margin)
      };

      addPoolBlanket(formattedData);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Pool Blanket</DialogTitle>
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
                      <Input {...field} placeholder="e.g. Piazza" />
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
                      <Input {...field} placeholder="e.g. Alto" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Blanket Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="blanket_sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blanket SKU</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. IX9B&R" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blanket_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blanket Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Product description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <FormField
                  control={form.control}
                  name="blanket_rrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RRP ($)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blanket_trade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trade Price ($)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blanket_margin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margin ($)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Heat Pump Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="heatpump_sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heat Pump SKU</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. IX9" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heatpump_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heat Pump Description</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Product description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <FormField
                  control={form.control}
                  name="heatpump_rrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RRP ($)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heatpump_trade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trade Price ($)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heatpump_margin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margin ($)</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.01" min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Blanket'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
