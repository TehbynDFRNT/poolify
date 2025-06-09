import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Responsibilities, R2_OPTIONS } from "@/types/contract-qa";

interface ResponsibilitiesSectionProps {
  data: Responsibilities;
  onChange: (data: Responsibilities) => void;
  readonly?: boolean;
  onSave?: () => void;
}

export const ResponsibilitiesSection: React.FC<ResponsibilitiesSectionProps> = ({
  data,
  onChange,
  readonly = false,
  onSave,
}) => {
  const handleFieldChange = (field: keyof Responsibilities, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Responsibilities – Fencing, Trees, etc.</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Clearly define who is responsible for removing and reinstating existing structures like fences, trees, and landscaping. This prevents disputes about scope of work and associated costs.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="fenceRemovalBy" className="text-base font-medium">Party responsible for removing fences</Label>
            <Select
              value={data.fenceRemovalBy}
              onValueChange={(value) => handleFieldChange("fenceRemovalBy", value)}
              disabled={readonly}
            >
              <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {R2_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="fenceReinstatementBy" className="text-base font-medium">Party responsible for reinstating fences</Label>
            <Select
              value={data.fenceReinstatementBy}
              onValueChange={(value) => handleFieldChange("fenceReinstatementBy", value)}
              disabled={readonly}
            >
              <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {R2_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="treeRemovalBy" className="text-base font-medium">Party responsible for removing trees / landscaping / walls</Label>
            <Select
              value={data.treeRemovalBy}
              onValueChange={(value) => handleFieldChange("treeRemovalBy", value)}
              disabled={readonly}
            >
              <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {R2_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="treeReinstatementBy" className="text-base font-medium">Party responsible for reinstating trees / landscaping / walls</Label>
            <Select
              value={data.treeReinstatementBy}
              onValueChange={(value) => handleFieldChange("treeReinstatementBy", value)}
              disabled={readonly}
            >
              <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {R2_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {!readonly && (
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={onSave}
              className="min-w-[140px]"
            >
              Save Responsibilities
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};