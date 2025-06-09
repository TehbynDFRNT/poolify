import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpecialWorkInstructions } from "@/types/contract-qa";

interface SpecialWorkInstructionsSectionProps {
  data: SpecialWorkInstructions;
  onChange: (data: SpecialWorkInstructions) => void;
  readonly?: boolean;
  onSave?: () => void;
}

export const SpecialWorkInstructionsSection: React.FC<SpecialWorkInstructionsSectionProps> = ({
  data,
  onChange,
  readonly = false,
  onSave,
}) => {
  const handleFieldChange = (field: keyof SpecialWorkInstructions, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Special-Work Instructions</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Describe any additional work, specialized materials, or unique requirements beyond the standard pool installation. Use this section to detail custom features or special instructions that affect the contract scope.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="extraOrSpecialWork" className="text-base font-medium">Extra or special work details</Label>
            <Textarea
              id="extraOrSpecialWork"
              value={data.extraOrSpecialWork}
              onChange={readonly ? undefined : (e) => handleFieldChange("extraOrSpecialWork", e.target.value)}
              placeholder="Enter details of extra or special work to be carried out, or materials/equipment to be supplied or included in the Contract Price"
              rows={6}
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
              Save Special Work Instructions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};