import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { useCustomAddOns, CustomAddOn } from "@/hooks/useCustomAddOns";
import { formatCurrency } from "@/utils/format";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface CustomAddOnsProps {
  customerId: string | null;
}

export const CustomAddOns: React.FC<CustomAddOnsProps> = ({
  customerId
}) => {
  const queryClient = useQueryClient();
  
  const {
    customAddOns,
    isLoading,
    isSaving,
    totals,
    addCustomAddOn,
    removeCustomAddOn,
    updateCustomAddOn,
    saveCustomAddOns,
    StatusWarningDialog
  } = useCustomAddOns(customerId);

  // Auto-save effect with direct Supabase calls
  useEffect(() => {
    if (!customerId || isLoading) return;

    const timer = setTimeout(async () => {
      try {
        console.log('🔄 Auto-saving custom add-ons...');
        
        // Delete existing custom add-ons first
        await supabase
          .from('pool_custom_addons')
          .delete()
          .eq('pool_project_id', customerId);

        // Only insert if there are custom add-ons with valid data
        const validAddOns = customAddOns.filter(addOn => 
          addOn.name && addOn.name.trim() !== '' && 
          addOn.cost !== null && 
          addOn.cost !== undefined &&
          addOn.cost >= 0
        );

        if (validAddOns.length > 0) {
          const toInsert = validAddOns.map(addOn => ({
            pool_project_id: customerId,
            name: addOn.name,
            cost: addOn.cost,
            margin: addOn.margin || 0,
            rrp: addOn.rrp || 0
          }));

          const { error } = await supabase
            .from('pool_custom_addons')
            .insert(toInsert);

          if (error) throw error;
        }

        // Invalidate queries to refresh data
        await queryClient.invalidateQueries({ queryKey: ['pool-custom-addons', customerId] });
        console.log('✅ Custom add-ons auto-saved successfully');
      } catch (error) {
        console.error("Error auto-saving custom add-ons:", error);
        toast.error("Failed to auto-save custom add-ons");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    JSON.stringify(customAddOns), // Stringify to create stable dependency
    customerId
  ]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Custom Add-Ons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading custom add-ons...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Custom Add-Ons</CardTitle>
            <Button 
              type="button" 
              size="sm" 
              onClick={addCustomAddOn}
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Custom Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customAddOns.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm border rounded-lg">
                No custom add-ons created. Click "Add Custom Item" to create custom pool add-ons.
              </div>
            ) : (
              customAddOns.map((addOn) => (
                <Card key={addOn.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div className="md:col-span-3">
                        <Label htmlFor={`addon-name-${addOn.id}`} className="mb-1 block">
                          Item Name / Description
                        </Label>
                        <Input
                          id={`addon-name-${addOn.id}`}
                          value={addOn.name}
                          onChange={(e) => updateCustomAddOn(addOn.id, 'name', e.target.value)}
                          placeholder="Enter custom add-on name"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`addon-cost-${addOn.id}`} className="mb-1 block">
                          Cost ($)
                        </Label>
                        <Input
                          id={`addon-cost-${addOn.id}`}
                          type="number"
                          value={addOn.cost || ''}
                          onChange={(e) => updateCustomAddOn(addOn.id, 'cost', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`addon-margin-${addOn.id}`} className="mb-1 block">
                          Margin ($)
                        </Label>
                        <Input
                          id={`addon-margin-${addOn.id}`}
                          type="number"
                          value={addOn.margin || ''}
                          onChange={(e) => updateCustomAddOn(addOn.id, 'margin', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label className="mb-1 block">Total Price ($)</Label>
                        <div className="flex">
                          <Input
                            type="text"
                            value={formatCurrency(addOn.rrp)}
                            readOnly
                            className="flex-1 bg-gray-50 text-gray-700"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="ml-1"
                            onClick={() => removeCustomAddOn(addOn.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Summary Section */}
          {customAddOns.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Custom Add-Ons Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Cost:</span>
                  <p className="font-medium">{formatCurrency(totals.totalCost)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Margin:</span>
                  <p className="font-medium">{formatCurrency(totals.totalMargin)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Price:</span>
                  <p className="font-medium text-green-600">{formatCurrency(totals.totalRrp)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Status Warning Dialog */}
      <StatusWarningDialog />
    </>
  );
};