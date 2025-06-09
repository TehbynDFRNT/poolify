import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { ExtraCostRiskFlags, R1_OPTIONS } from "@/types/contract-qa";

interface ExtraCostRiskFlagsSectionProps {
  data: ExtraCostRiskFlags;
  onChange: (data: ExtraCostRiskFlags) => void;
  readonly?: boolean;
  onSave?: () => void;
}

export const ExtraCostRiskFlagsSection: React.FC<ExtraCostRiskFlagsSectionProps> = ({
  data,
  onChange,
  readonly = false,
  onSave,
}) => {
  const handleFieldChange = (field: keyof ExtraCostRiskFlags, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const riskFields = [
    { key: "locatingBoundaries", label: "Extra costs incurred by the contractor in locating site boundaries and underground services (Refer Clause 6.4)" },
    { key: "difficultAccess", label: "Extra costs incurred by the contractor in accessing the site (Refer Clause 7.4)" },
    { key: "ownerInterference", label: "Extra costs for owner interference claimed by the contractor (Refer Clause 7.6)" },
    { key: "primeCostVariance", label: "The actual cost of prime cost items / provisional sums being less or exceeding the estimates (Refer Clause 13)" },
    { key: "statutoryVariations", label: "Variations required by a statutory authority incl. private certifier (Refer Clause 14)" },
    { key: "delayedProgress", label: "Where commencement or progress of the works is delayed (Refer Clause 15)" },
    { key: "latentConditions", label: "Extra costs incurred to overcome latent conditions (Refer Clause 16)" },
    { key: "suspensionCosts", label: "Extra costs incurred as a result of a suspension of the works (Refer Clause 17)" },
    { key: "excavatedFillCartage", label: "Extra costs incurred in carting and dumping excavated fill (Refer Clause 20.6)" },
    { key: "productSubstitution", label: "Extra costs as a result of a product substitution (Refer Clause 22.9)" },
    { key: "specialConditions", label: "Any special conditions that may result in cost increases (Refer Clause 39)" },
    { key: "thirdPartyComponents", label: "The contract price does not include the cost of any third party components (see Item 4 & Schedule 3)" },
  ] as const;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Extra-Cost Risk Flags (Item 8 of the schedule)</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Identify potential situations that could result in additional costs during construction. These flags help both parties understand where extra charges may apply according to contract clauses.
        </p>
        
        <div className="grid gap-6">
          {riskFields.map(({ key, label }) => (
            <div key={key} className="grid gap-3">
              <Label htmlFor={key}>{label}</Label>
              <Select
                value={data[key]}
                onValueChange={(value) => handleFieldChange(key, value)}
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
          ))}
        </div>
        
        {!readonly && (
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={onSave}
              className="min-w-[140px]"
            >
              Save Extra Cost Risks
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};