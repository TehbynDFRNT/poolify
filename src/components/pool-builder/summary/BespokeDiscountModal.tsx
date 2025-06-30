import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DollarSign, Percent } from "lucide-react";

interface BespokeDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (discount: {
    discount_name: string;
    discount_type: 'dollar' | 'percentage';
    value: number;
  }) => void;
  isLoading?: boolean;
  proposalName?: string;
}

export const BespokeDiscountModal: React.FC<BespokeDiscountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  proposalName = "",
}) => {
  const [discountType, setDiscountType] = useState<'dollar' | 'percentage'>('dollar');
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState<{ value?: string }>({});

  const validate = () => {
    const newErrors: { value?: string } = {};
    
    const numValue = parseFloat(value);
    if (!value || isNaN(numValue) || numValue <= 0) {
      newErrors.value = "Please enter a valid positive number";
    }
    
    if (discountType === 'percentage' && numValue > 100) {
      newErrors.value = "Percentage cannot exceed 100%";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    onSave({
      discount_name: `${proposalName} - Bespoke Discount`,
      discount_type: discountType,
      value: parseFloat(value),
    });
  };

  const handleClose = () => {
    setDiscountType('dollar');
    setValue("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Bespoke Discount</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="discount-name">Discount Name</Label>
            <Input
              id="discount-name"
              value={`${proposalName} - Bespoke Discount`}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-600">
              This discount will be linked to this proposal only
            </p>
          </div>

          <div className="space-y-2">
            <Label>Discount Type</Label>
            <RadioGroup value={discountType} onValueChange={(value: 'dollar' | 'percentage') => setDiscountType(value)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dollar" id="dollar" />
                <Label htmlFor="dollar" className="flex items-center cursor-pointer">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Dollar Amount
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="percentage" id="percentage" />
                <Label htmlFor="percentage" className="flex items-center cursor-pointer">
                  <Percent className="h-4 w-4 mr-1" />
                  Percentage
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount-value">
              {discountType === 'dollar' ? 'Discount Amount ($)' : 'Discount Percentage (%)'}
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {discountType === 'dollar' ? (
                  <DollarSign className="h-4 w-4 text-gray-400" />
                ) : (
                  <Percent className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <Input
                id="discount-value"
                type="number"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (errors.value) setErrors({ ...errors, value: undefined });
                }}
                placeholder={discountType === 'dollar' ? "0.00" : "0"}
                className={`pl-10 ${errors.value ? "border-red-500" : ""}`}
                step={discountType === 'dollar' ? "0.01" : "1"}
                min="0"
                max={discountType === 'percentage' ? "100" : undefined}
              />
            </div>
            {errors.value && (
              <p className="text-sm text-red-500">{errors.value}</p>
            )}
            {discountType === 'percentage' && (
              <p className="text-sm text-gray-600">
                Note: Percentage discounts exclude fencing and electrical costs
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Discount"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};