
import React, { useState } from "react";
import { Pool } from "@/types/pool";
import { Fence, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

interface FramelessGlassFencingProps {
  pool: Pool;
  customerId: string;
}

const fencingSchema = z.object({
  linearMeters: z.coerce.number().min(0, "Must be a positive number"),
  simpleGates: z.coerce.number().min(0, "Must be 0 or more"),
  complexGates: z.coerce.number().min(0, "Must be 0 or more"),
  simplePanels: z.coerce.number().min(0, "Must be 0 or more"),
  complexPanels: z.coerce.number().min(0, "Must be 0 or more"),
  earthingRequired: z.boolean().default(false),
});

type FencingFormValues = z.infer<typeof fencingSchema>;

export const FramelessGlassFencing: React.FC<FramelessGlassFencingProps> = ({ pool, customerId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FencingFormValues>({
    resolver: zodResolver(fencingSchema),
    defaultValues: {
      linearMeters: 0,
      simpleGates: 0,
      complexGates: 0,
      simplePanels: 0,
      complexPanels: 0,
      earthingRequired: false,
    },
  });

  const watchedValues = form.watch();
  
  // Calculate costs
  const calculateCosts = () => {
    const linearCost = watchedValues.linearMeters * 396;
    const totalGates = watchedValues.simpleGates + watchedValues.complexGates;
    const gatesCost = totalGates * 495;
    const freeGateDiscount = totalGates > 0 ? -495 : 0;
    const simplePanelsCost = watchedValues.simplePanels * 220;
    const complexPanelsCost = watchedValues.complexPanels * 660;
    const earthingCost = watchedValues.earthingRequired ? 40 : 0;
    
    const totalCost = linearCost + gatesCost + freeGateDiscount + simplePanelsCost + complexPanelsCost + earthingCost;
    
    return {
      linearCost,
      gatesCost,
      freeGateDiscount,
      simplePanelsCost,
      complexPanelsCost,
      earthingCost,
      totalCost,
    };
  };
  
  const costs = calculateCosts();

  const onSubmit = async (data: FencingFormValues) => {
    setIsSubmitting(true);
    
    try {
      // This would be where you'd save to your database
      console.log("Saving fencing data:", data);
      console.log("For customer:", customerId);
      console.log("For pool:", pool.id);
      
      toast.success("Fencing configuration saved successfully");
    } catch (error) {
      console.error("Error saving fencing data:", error);
      toast.error("Failed to save fencing configuration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Frameless Glass Fencing</h2>
      </div>
      
      <Card>
        <CardHeader className="bg-primary/10">
          <div className="flex items-start gap-3">
            <Fence className="h-5 w-5 text-primary mt-1" />
            <div>
              <CardTitle>Fencing Specifications</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Customize your frameless glass fencing options below
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Linear Meters Input */}
                <FormField
                  control={form.control}
                  name="linearMeters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enter total fence length (m)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.1" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Cost: ${costs.linearCost.toFixed(2)} (${396} per meter)
                      </FormDescription>
                    </FormItem>
                  )}
                />
                
                {/* Gate Types Section */}
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="text-sm font-medium">Gate Selection</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="simpleGates"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Simple Gates</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="complexGates"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complex Gates</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="text-xs">
                    <p>Cost: ${costs.gatesCost.toFixed(2)} (${495} per gate)</p>
                    {costs.freeGateDiscount !== 0 && (
                      <p className="text-green-600">Free Gate Discount: ${costs.freeGateDiscount.toFixed(2)}</p>
                    )}
                  </div>
                </div>
                
                {/* FG Retaining Panel Section */}
                <div className="space-y-4 border p-4 rounded-md">
                  <h3 className="text-sm font-medium">FG Retaining Panels</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="simplePanels"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Simple FG Retaining Panel</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="complexPanels"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Complex FG Retaining Panel</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="text-xs space-y-1">
                    <p>Simple Panels: ${costs.simplePanelsCost.toFixed(2)} (${220} each)</p>
                    <p>Complex Panels: ${costs.complexPanelsCost.toFixed(2)} (${660} each)</p>
                  </div>
                </div>
                
                {/* Earthing Toggle */}
                <FormField
                  control={form.control}
                  name="earthingRequired"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Include earthing?</FormLabel>
                        <FormDescription>
                          Adds a flat fee of $40 to the total
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Cost Summary */}
              <Card className="bg-muted/40">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-lg">Cost Summary</h3>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Fence Linear Cost:</span>
                        <span>${costs.linearCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Gates Cost:</span>
                        <span>${costs.gatesCost.toFixed(2)}</span>
                      </div>
                      {costs.freeGateDiscount !== 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Free Gate Discount:</span>
                          <span>${costs.freeGateDiscount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Simple Panels Cost:</span>
                        <span>${costs.simplePanelsCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Complex Panels Cost:</span>
                        <span>${costs.complexPanelsCost.toFixed(2)}</span>
                      </div>
                      {costs.earthingCost > 0 && (
                        <div className="flex justify-between">
                          <span>Earthing Cost:</span>
                          <span>${costs.earthingCost.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold pt-2 border-t mt-2">
                        <span>Total Cost:</span>
                        <span>${costs.totalCost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? "Saving..." : "Save Fencing Configuration"}
                </Button>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md flex items-start gap-2">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-blue-700">
                  The frameless glass fencing cost is calculated using the formula: 
                  (Lineal Meters × $396) + (Gates × $495) − One Free Gate ($495) + Panel costs + Earthing (if selected).
                </p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
