
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import { Loader2 } from "lucide-react";

interface AddHeatPumpFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: Omit<HeatPumpProduct, "id" | "created_at">) => Promise<void>;
  initialValues?: HeatPumpProduct | null;
  isEditMode?: boolean;
}

export const AddHeatPumpForm: React.FC<AddHeatPumpFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  isEditMode = false
}) => {
  const [sku, setSku] = useState(initialValues?.hp_sku || "");
  const [description, setDescription] = useState(initialValues?.hp_description || "");
  const [cost, setCost] = useState(initialValues?.cost || 0);
  const [rrp, setRrp] = useState(initialValues?.rrp || 0);
  const [margin, setMargin] = useState(initialValues?.margin || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Calculate margin automatically when cost or rrp changes
  const handleCostChange = (value: string) => {
    const newCost = parseFloat(value) || 0;
    setCost(newCost);
    const newMargin = rrp - newCost;
    setMargin(Math.max(0, newMargin));
  };

  const handleRrpChange = (value: string) => {
    const newRrp = parseFloat(value) || 0;
    setRrp(newRrp);
    const newMargin = newRrp - cost;
    setMargin(Math.max(0, newMargin));
  };

  const resetForm = () => {
    setSku(initialValues?.hp_sku || "");
    setDescription(initialValues?.hp_description || "");
    setCost(initialValues?.cost || 0);
    setRrp(initialValues?.rrp || 0);
    setMargin(initialValues?.margin || 0);
    setFormError(null);
  };

  React.useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, initialValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!sku.trim()) {
      setFormError("SKU is required");
      return;
    }

    if (!description.trim()) {
      setFormError("Description is required");
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      // Ensure we have all required fields before submitting
      await onSubmit({
        hp_sku: sku,
        hp_description: description,
        cost: cost,
        rrp: rrp,
        margin: margin
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Form submission error:", error);
      setFormError("An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Heat Pump" : "Add New Heat Pump"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
              {formError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input 
              id="sku" 
              value={sku} 
              onChange={(e) => setSku(e.target.value)}
              placeholder="Enter heat pump SKU"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter heat pump description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost ($)</Label>
              <Input 
                id="cost" 
                type="number"
                value={cost} 
                onChange={(e) => handleCostChange(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rrp">RRP ($)</Label>
              <Input 
                id="rrp" 
                type="number"
                value={rrp} 
                onChange={(e) => handleRrpChange(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="margin">Margin ($)</Label>
              <Input 
                id="margin" 
                type="number"
                value={margin} 
                readOnly
                className="bg-slate-50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditMode ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
