import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessSiteConditions, R1_OPTIONS } from "@/types/contract-qa";

interface AccessSiteConditionsSectionProps {
  data: AccessSiteConditions;
  onChange: (data: AccessSiteConditions) => void;
  readonly?: boolean;
  onSave?: () => void;
}

export const AccessSiteConditionsSection: React.FC<AccessSiteConditionsSectionProps> = ({
  data,
  onChange,
  readonly = false,
  onSave,
}) => {
  const handleFieldChange = (field: keyof AccessSiteConditions, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Access & Site Conditions</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Document site access requirements, including pathway dimensions and crane clearances. This information ensures proper planning for equipment and material delivery during construction.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="accessVideoProvided" className="text-base font-medium">
              Animated video / sketch of access path provided? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.accessVideoProvided}
              onValueChange={(value) => handleFieldChange("accessVideoProvided", value)}
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
            <Label htmlFor="minAccessWidthMm" className="text-base font-medium">
              Minimum access width (mm) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="minAccessWidthMm"
              type="number"
              value={data.minAccessWidthMm}
              onChange={readonly ? undefined : (e) => handleFieldChange("minAccessWidthMm", parseInt(e.target.value) || "")}
              placeholder="Width in millimeters"
              min="1"
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="minAccessHeightMm" className="text-base font-medium">
              Minimum access height (mm) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="minAccessHeightMm"
              type="number"
              value={data.minAccessHeightMm}
              onChange={readonly ? undefined : (e) => handleFieldChange("minAccessHeightMm", parseInt(e.target.value) || "")}
              placeholder="Height in millimeters"
              min="1"
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="craneRequired" className="text-base font-medium">
              Is a crane required? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.craneRequired}
              onValueChange={(value) => handleFieldChange("craneRequired", value)}
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

          {data.craneRequired === "Yes" && (
            <div className="grid gap-3">
              <Label htmlFor="minCraneClearanceMm" className="text-base font-medium">
                Minimum crane clearance (mm) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="minCraneClearanceMm"
                type="number"
                value={data.minCraneClearanceMm}
                onChange={readonly ? undefined : (e) => handleFieldChange("minCraneClearanceMm", parseInt(e.target.value) || "")}
                placeholder="Clearance in millimeters"
                min="1"
                readOnly={readonly}
                className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
              />
            </div>
          )}

          <div className="grid gap-3">
            <Label htmlFor="fencesInAccessPath" className="text-base font-medium">
              Are fences in / near the access path? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.fencesInAccessPath}
              onValueChange={(value) => handleFieldChange("fencesInAccessPath", value)}
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
              Save Access & Site Conditions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};