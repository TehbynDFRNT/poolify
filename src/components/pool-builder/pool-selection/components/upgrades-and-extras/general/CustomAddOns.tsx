import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { useCustomAddOns, CustomAddOn } from "@/hooks/useCustomAddOns";
import { formatCurrency } from "@/utils/format";

interface CustomAddOnsProps {
  customerId: string | null;
}

export const CustomAddOns: React.FC<CustomAddOnsProps> = ({
  customerId
}) => {
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

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <Button 
              onClick={saveCustomAddOns}
              disabled={isSaving || customAddOns.length === 0}
              className="w-full md:w-auto"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Custom Add-Ons
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Warning Dialog */}
      <StatusWarningDialog />
    </>
  );
};