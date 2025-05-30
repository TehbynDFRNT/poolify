import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { SafetyTemporaryWorks, R1_OPTIONS, R5_OPTIONS } from "@/types/contract-qa";

interface SafetyTemporaryWorksSectionProps {
  data: SafetyTemporaryWorks;
  onChange: (data: SafetyTemporaryWorks) => void;
  readonly?: boolean;
  onSave?: () => void;
}

export const SafetyTemporaryWorksSection: React.FC<SafetyTemporaryWorksSectionProps> = ({
  data,
  onChange,
  readonly = false,
  onSave,
}) => {
  const handleFieldChange = (field: keyof SafetyTemporaryWorks, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Safety & Temporary Works</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Specify safety requirements and temporary installations needed during construction, including barriers, power connections, and protective covers. These measures ensure compliance with safety regulations and protect the work site.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="tempPoolSafetyBarrier" className="text-base font-medium">
              Temporary pool safety barrier required? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.tempPoolSafetyBarrier}
              onValueChange={(value) => handleFieldChange("tempPoolSafetyBarrier", value)}
              disabled={readonly}
            >
              <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {R1_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {data.tempPoolSafetyBarrier === "Yes" && (
            <div className="grid gap-3">
              <Label htmlFor="tempSafetyBarrierType" className="text-base font-medium">
                Type of temporary safety barrier <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.tempSafetyBarrierType}
                onValueChange={(value) => handleFieldChange("tempSafetyBarrierType", value)}
                disabled={readonly}
              >
                <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {R5_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-3">
            <Label htmlFor="powerConnectionProvided" className="text-base font-medium">
              Power connection (temp‐works) <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.powerConnectionProvided}
              onValueChange={(value) => handleFieldChange("powerConnectionProvided", value)}
              disabled={readonly}
            >
              <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {R1_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="hardCoverRequired" className="text-base font-medium">
              Hard cover over pool shell required? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.hardCoverRequired}
              onValueChange={(value) => handleFieldChange("hardCoverRequired", value)}
              disabled={readonly}
            >
              <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {R1_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="permPoolSafetyBarrier" className="text-base font-medium">
              Permanent pool safety barrier included? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.permPoolSafetyBarrier}
              onValueChange={(value) => handleFieldChange("permPoolSafetyBarrier", value)}
              disabled={readonly}
            >
              <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {R1_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="tempFenceProvided" className="text-base font-medium">
              Temporary fence supplied? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.tempFenceProvided}
              onValueChange={(value) => handleFieldChange("tempFenceProvided", value)}
              disabled={readonly}
            >
              <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {R1_OPTIONS.map((option) => (
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
              Save Safety & Temporary Works
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};