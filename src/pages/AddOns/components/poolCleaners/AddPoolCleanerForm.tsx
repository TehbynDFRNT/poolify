
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePoolCleaners } from "@/hooks/usePoolCleaners";
import { toast } from "sonner";

interface AddPoolCleanerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPoolCleanerForm({ open, onOpenChange }: AddPoolCleanerFormProps) {
  const { addPoolCleaner } = usePoolCleaners();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    model_number: "",
    name: "",
    price: "",
    cost_price: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.price || !formData.cost_price) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      // Calculate margin based on price and cost price
      const price = parseFloat(formData.price);
      const costPrice = parseFloat(formData.cost_price);
      const marginAmount = price - costPrice;
      const margin = Math.round((marginAmount / price) * 100);

      addPoolCleaner({
        model_number: formData.model_number,
        name: formData.name,
        rrp: price,
        trade: costPrice,
        margin: margin,
        description: formData.description || "",
        sku: formData.model_number, // Using model_number as SKU
      });

      // Reset form and close dialog
      setFormData({
        model_number: "",
        name: "",
        price: "",
        cost_price: "",
        description: "",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding pool cleaner:", error);
      toast.error("Failed to add pool cleaner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Pool Cleaner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model_number">Model Number *</Label>
            <Input
              id="model_number"
              name="model_number"
              value={formData.model_number}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">RRP ($) *</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost_price">Cost Price ($) *</Label>
            <Input
              id="cost_price"
              name="cost_price"
              type="number"
              step="0.01"
              value={formData.cost_price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Add a description of the pool cleaner"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Cleaner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
