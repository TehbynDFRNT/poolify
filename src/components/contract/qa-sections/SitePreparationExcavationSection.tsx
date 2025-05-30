import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shovel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SitePreparationExcavation, R1_OPTIONS, R2_OPTIONS, R3_OPTIONS, S1_OPTIONS } from "@/types/contract-qa";

interface SitePreparationExcavationSectionProps {
  data: SitePreparationExcavation;
  onChange: (data: SitePreparationExcavation) => void;
  readonly?: boolean;
  onSave?: () => void;
}

export const SitePreparationExcavationSection: React.FC<SitePreparationExcavationSectionProps> = ({
  data,
  onChange,
  readonly = false,
  onSave,
}) => {
  const handleFieldChange = (field: keyof SitePreparationExcavation, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Shovel className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Site Preparation & Excavation</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Define excavation methods, site preparation requirements, and material handling procedures. This section clarifies responsibilities for removing obstacles, digging the pool, and managing excavated soil.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="treesOrWallsRemovalNeeded" className="text-base font-medium">
              Trees / landscaping / walls require removal? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.treesOrWallsRemovalNeeded}
              onValueChange={(value) => handleFieldChange("treesOrWallsRemovalNeeded", value)}
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
            <Label htmlFor="overburdenRemovalResp" className="text-base font-medium">Removal of over-burden & site prep</Label>
            <Select
              value={data.overburdenRemovalResp}
              onValueChange={(value) => handleFieldChange("overburdenRemovalResp", value)}
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
            <Label htmlFor="excavationRequiredBy" className="text-base font-medium">Excavation required for pool</Label>
            <Select
              value={data.excavationRequiredBy}
              onValueChange={(value) => handleFieldChange("excavationRequiredBy", value)}
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
            <Label htmlFor="excavationMethod" className="text-base font-medium">
              Method of excavation <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.excavationMethod}
              onValueChange={(value) => handleFieldChange("excavationMethod", value)}
              disabled={readonly}
            >
              <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {R3_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="serviceLinesRelocationNeeded" className="text-base font-medium">
              Do service lines (water, gas, sewer) need relocation? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.serviceLinesRelocationNeeded}
              onValueChange={(value) => handleFieldChange("serviceLinesRelocationNeeded", value)}
              disabled={readonly}
            >
              <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {S1_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="serviceLinesRelocatedBy" className="text-base font-medium">Party responsible for relocating service lines</Label>
            <Select
              value={data.serviceLinesRelocatedBy}
              onValueChange={(value) => handleFieldChange("serviceLinesRelocatedBy", value)}
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
            <Label htmlFor="excavatedMaterialLeftOnSite" className="text-base font-medium">
              Excavated material left on-site? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.excavatedMaterialLeftOnSite}
              onValueChange={(value) => handleFieldChange("excavatedMaterialLeftOnSite", value)}
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
            <Label htmlFor="excavatedMaterialRemoved" className="text-base font-medium">
              Excavated material removed from site? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.excavatedMaterialRemoved}
              onValueChange={(value) => handleFieldChange("excavatedMaterialRemoved", value)}
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
            <Label htmlFor="excavatedMaterialRemovedBy" className="text-base font-medium">Party responsible for removal of excavated material</Label>
            <Select
              value={data.excavatedMaterialRemovedBy}
              onValueChange={(value) => handleFieldChange("excavatedMaterialRemovedBy", value)}
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
              Save Site Preparation & Excavation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};