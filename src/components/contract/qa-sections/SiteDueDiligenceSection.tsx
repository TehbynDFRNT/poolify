import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { SiteDueDiligenceNotes } from "@/types/contract-qa";

interface SiteDueDiligenceSectionProps {
  data: SiteDueDiligenceNotes;
  onChange: (data: SiteDueDiligenceNotes) => void;
  readonly?: boolean;
  onSave?: () => void;
}

export const SiteDueDiligenceSection: React.FC<SiteDueDiligenceSectionProps> = ({
  data,
  onChange,
  readonly = false,
  onSave,
}) => {
  const handleFieldChange = (field: keyof SiteDueDiligenceNotes, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Site Due-Diligence Notes</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Document site investigation findings and any known restrictions or conditions. Include utility location reports (Before You Dig) and planning constraints that may affect construction.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="mattersAffectingSiteByd" className="text-base font-medium">BYD / canibuild findings & reference numbers</Label>
            <Textarea
              id="mattersAffectingSiteByd"
              value={data.mattersAffectingSiteByd}
              onChange={readonly ? undefined : (e) => handleFieldChange("mattersAffectingSiteByd", e.target.value)}
              placeholder="Enter findings from Before You Dig and canibuild investigations, including reference numbers"
              rows={4}
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="mattersAffectingSiteOwner" className="text-base font-medium">Other matters the owner is aware of</Label>
            <Textarea
              id="mattersAffectingSiteOwner"
              value={data.mattersAffectingSiteOwner}
              onChange={readonly ? undefined : (e) => handleFieldChange("mattersAffectingSiteOwner", e.target.value)}
              placeholder="Enter any other matters affecting the site (easements, building covenants, planning restrictions, etc.)"
              rows={4}
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
              Save Site Due Diligence
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};