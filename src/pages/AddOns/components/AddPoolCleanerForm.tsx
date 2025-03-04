
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    margin: "30", // Default margin
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.model_number || !formData.name || !formData.price) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      addPoolCleaner({
        model_number: formData.model_number,
        name: formData.name,
        price: parseFloat(formData.price),
        margin: parseFloat(formData.margin || "30"),
      });

      // Reset form and close dialog
      setFormData({
        model_number: "",
        name: "",
        price: "",
        margin: "30",
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding pool cleaner:", error);
      toast.error("Failed to add pool cleaner");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
            <Label htmlFor="margin">Margin (%)</Label>
            <Input
              id="margin"
              name="margin"
              type="number"
              step="1"
              value={formData.margin}
              onChange={handleChange}
            />
          </div>

          <div className="flex justify-end gap-2">
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
