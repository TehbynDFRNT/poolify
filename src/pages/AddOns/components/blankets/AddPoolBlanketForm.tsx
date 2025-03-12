
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePoolBlankets } from "@/hooks/usePoolBlankets";
import { PoolBlanket } from "@/types/pool-blanket";

const formSchema = z.object({
  pool_range: z.string().min(1, "Pool range is required"),
  pool_model: z.string().min(1, "Pool model is required"),
  blanket_sku: z.string().min(1, "Blanket SKU is required"),
  blanket_description: z.string().min(1, "Blanket description is required"),
  blanket_rrp: z.string().min(1, "Blanket RRP is required"),
  blanket_trade: z.string().min(1, "Blanket trade is required"),
  blanket_margin: z.string().min(1, "Blanket margin is required"),
  heatpump_sku: z.string().min(1, "Heat pump SKU is required"),
  heatpump_description: z.string().min(1, "Heat pump description is required"),
  heatpump_rrp: z.string().min(1, "Heat pump RRP is required"),
  heatpump_trade: z.string().min(1, "Heat pump trade is required"),
  heatpump_margin: z.string().min(1, "Heat pump margin is required"),
});

type FormData = z.infer<typeof formSchema>;

interface AddPoolBlanketFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editBlanket?: PoolBlanket | null;
}

export const AddPoolBlanketForm = ({
  open,
  onOpenChange,
  editBlanket = null,
}: AddPoolBlanketFormProps) => {
  const { addPoolBlanket, updatePoolBlanket } = usePoolBlankets();
  const isEditing = !!editBlanket;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pool_range: "",
      pool_model: "",
      blanket_sku: "",
      blanket_description: "",
      blanket_rrp: "",
      blanket_trade: "",
      blanket_margin: "",
      heatpump_sku: "",
      heatpump_description: "",
      heatpump_rrp: "",
      heatpump_trade: "",
      heatpump_margin: "",
    },
  });

  useEffect(() => {
    if (editBlanket) {
      form.reset({
        pool_range: editBlanket.pool_range,
        pool_model: editBlanket.pool_model,
        blanket_sku: editBlanket.blanket_sku,
        blanket_description: editBlanket.blanket_description,
        blanket_rrp: editBlanket.blanket_rrp.toString(),
        blanket_trade: editBlanket.blanket_trade.toString(),
        blanket_margin: editBlanket.blanket_margin.toString(),
        heatpump_sku: editBlanket.heatpump_sku,
        heatpump_description: editBlanket.heatpump_description,
        heatpump_rrp: editBlanket.heatpump_rrp.toString(),
        heatpump_trade: editBlanket.heatpump_trade.toString(),
        heatpump_margin: editBlanket.heatpump_margin.toString(),
      });
    } else {
      form.reset({
        pool_range: "",
        pool_model: "",
        blanket_sku: "",
        blanket_description: "",
        blanket_rrp: "",
        blanket_trade: "",
        blanket_margin: "",
        heatpump_sku: "",
        heatpump_description: "",
        heatpump_rrp: "",
        heatpump_trade: "",
        heatpump_margin: "",
      });
    }
  }, [editBlanket, form]);

  const onSubmit = (data: FormData) => {
    const blanketData = {
      pool_range: data.pool_range,
      pool_model: data.pool_model,
      blanket_sku: data.blanket_sku,
      blanket_description: data.blanket_description,
      blanket_rrp: parseFloat(data.blanket_rrp),
      blanket_trade: parseFloat(data.blanket_trade),
      blanket_margin: parseFloat(data.blanket_margin),
      heatpump_sku: data.heatpump_sku,
      heatpump_description: data.heatpump_description,
      heatpump_rrp: parseFloat(data.heatpump_rrp),
      heatpump_trade: parseFloat(data.heatpump_trade),
      heatpump_margin: parseFloat(data.heatpump_margin),
    };

    if (isEditing && editBlanket) {
      updatePoolBlanket({ id: editBlanket.id, updates: blanketData });
    } else {
      addPoolBlanket(blanketData);
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Pool Blanket" : "Add New Pool Blanket"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pool_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pool Range</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Piazza" {...field} />
                    </FormControl>
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
                      <Input placeholder="e.g. Alto" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Blanket Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="blanket_sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blanket SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. IX9B&R INS ONLY" {...field} />
                      </FormControl>
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
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="blanket_rrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RRP</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blanket_trade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trade</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blanket_margin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margin</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Heat Pump Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="heatpump_sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heat Pump SKU</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. IX9" {...field} />
                      </FormControl>
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
                        <Input placeholder="Description" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="heatpump_rrp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RRP</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heatpump_trade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trade</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="heatpump_margin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margin</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Update" : "Add"} Blanket
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
