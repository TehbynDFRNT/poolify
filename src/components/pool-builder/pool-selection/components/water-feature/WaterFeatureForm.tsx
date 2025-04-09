
import React from "react";
import { Pool } from "@/types/pool";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  useWaterFeature, 
  WATER_FEATURE_SIZES, 
  FRONT_FINISH_OPTIONS, 
  FINISH_OPTIONS, 
  LED_BLADE_OPTIONS,
  BACK_CLADDING_PRICE,
  BACK_CLADDING_MARGIN,
  WaterFeatureFormValues
} from "./useWaterFeature";
import { WaterFeatureCostSummary } from "./WaterFeatureCostSummary";

interface WaterFeatureFormProps {
  pool: Pool;
  customerId: string | null;
}

export const WaterFeatureForm: React.FC<WaterFeatureFormProps> = ({
  pool,
  customerId,
}) => {
  const { form, summary, isSubmitting } = useWaterFeature();

  const onSubmit = async (data: WaterFeatureFormValues) => {
    if (!customerId || !pool) {
      toast.error("Missing customer or pool information");
      return;
    }

    try {
      // Here you would typically save the data to your database
      // For example using supabase client
      
      // const { error } = await supabase
      //   .from('pool_water_features')
      //   .upsert({
      //     customer_id: customerId,
      //     pool_id: pool.id,
      //     ...data,
      //     total_cost: summary.totalCost
      //   });
      
      // if (error) throw error;
      
      // Mock successful saving for now
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success("Water feature options saved successfully");
    } catch (error) {
      console.error("Error saving water feature:", error);
      toast.error("Failed to save water feature options");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Water Feature Size */}
                <FormField
                  control={form.control}
                  name="waterFeatureSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Feature Size</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {WATER_FEATURE_SIZES.map((size) => (
                            <SelectItem key={size.id} value={size.id}>
                              {size.size} - ${size.total}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Back Cladding Needed */}
                <FormField
                  control={form.control}
                  name="backCladdingNeeded"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Back Cladding Needed
                        </FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Additional ${BACK_CLADDING_PRICE} (includes ${BACK_CLADDING_MARGIN} margin)
                        </div>
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

                {/* Front Finish */}
                <FormField
                  control={form.control}
                  name="frontFinish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Front Finish</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select front finish" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FRONT_FINISH_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Top Finish */}
                <FormField
                  control={form.control}
                  name="topFinish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Top Finish</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select top finish" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FINISH_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Sides Finish */}
                <FormField
                  control={form.control}
                  name="sidesFinish"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sides Finish</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sides finish" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FINISH_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* LED Blade Selection */}
                <FormField
                  control={form.control}
                  name="ledBlade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LED Blade Selection</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select LED blade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LED_BLADE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                              {option.price > 0 && ` - $${option.price} (includes $${option.margin} margin)`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Water Feature Options"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Cost Summary */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Cost Summary</h3>
        <WaterFeatureCostSummary
          basePrice={summary.basePrice}
          backCladdingPrice={summary.backCladdingPrice}
          bladePrice={summary.bladePrice}
          totalCost={summary.totalCost}
          hasBackCladding={form.getValues().backCladdingNeeded}
          selectedBlade={summary.selectedBladeName}
          baseMargin={summary.baseMargin}
          backCladdingMargin={summary.backCladdingMargin}
          bladeMargin={summary.bladeMargin}
        />
      </div>
    </div>
  );
};
