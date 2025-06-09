import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { OwnerSuppliedItems } from "@/types/contract-qa";

interface OwnerSuppliedItemsSectionProps {
  data: OwnerSuppliedItems;
  onChange: (data: OwnerSuppliedItems) => void;
  readonly?: boolean;
  onSave?: () => void;
}

export const OwnerSuppliedItemsSection: React.FC<OwnerSuppliedItemsSectionProps> = ({
  data,
  onChange,
  readonly = false,
  onSave,
}) => {
  const handleFieldChange = (field: keyof OwnerSuppliedItems, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Owner-Supplied Items</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Record any materials, equipment, or components that the property owner will provide for the pool construction. This clarifies what items are excluded from the contractor's supply obligations.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="ownerSuppliedItem1" className="text-base font-medium">Owner-supplied item #1</Label>
            <Input
              id="ownerSuppliedItem1"
              value={data.ownerSuppliedItem1}
              onChange={readonly ? undefined : (e) => handleFieldChange("ownerSuppliedItem1", e.target.value)}
              placeholder="Description of first owner-supplied item"
              maxLength={150}
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="ownerSuppliedItem2" className="text-base font-medium">Owner-supplied item #2</Label>
            <Input
              id="ownerSuppliedItem2"
              value={data.ownerSuppliedItem2}
              onChange={readonly ? undefined : (e) => handleFieldChange("ownerSuppliedItem2", e.target.value)}
              placeholder="Description of second owner-supplied item"
              maxLength={150}
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>
        </div>
        
        {!readonly && (
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={onSave}
              className="min-w-[140px]"
            >
              Save Owner Supplied Items
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};