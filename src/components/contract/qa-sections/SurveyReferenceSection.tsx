import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurveyReference } from "@/types/contract-qa";

interface SurveyReferenceSectionProps {
  data: SurveyReference;
  onChange: (data: SurveyReference) => void;
  readonly?: boolean;
  onSave?: () => void;
}

export const SurveyReferenceSection: React.FC<SurveyReferenceSectionProps> = ({
  data,
  onChange,
  readonly = false,
  onSave,
}) => {
  const handleFieldChange = (field: keyof SurveyReference, value: any) => {
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
          <h3 className="text-lg font-medium">Survey Reference</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Establish the elevation reference point for accurate pool positioning and water level calculations. The datum point ensures proper drainage and compliance with design specifications.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="datumPoint" className="text-base font-medium">Datum point (mm above/below AHD)</Label>
            <Input
              id="datumPoint"
              type="number"
              value={data.datumPoint}
              onChange={readonly ? undefined : (e) => handleFieldChange("datumPoint", parseInt(e.target.value) || "")}
              placeholder="Enter datum point measurement"
              min="0"
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
              Save Survey Reference
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};