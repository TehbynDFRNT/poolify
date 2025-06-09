import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Package, Check, X } from "lucide-react";
import { ContractInclusions, IEValues, ECValues, IE_OPTIONS, EC_OPTIONS } from "@/types/contract-qa";

interface InclusionsSectionProps {
  data: ContractInclusions;
  onChange: (data: ContractInclusions) => void;
  readonly?: boolean;
  onSave?: () => void;
}

export const InclusionsSection: React.FC<InclusionsSectionProps> = ({
  data,
  onChange,
  readonly = false,
  onSave,
}) => {
  const handleFieldChange = (field: keyof ContractInclusions, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // Helper function to get the status icon
  const getStatusIcon = (value: string) => {
    if (value === "Included") {
      return <Check className="h-5 w-5 text-green-600" />;
    } else if (value === "Not Included") {
      return <X className="h-5 w-5 text-red-600" />;
    } else if (value && value !== "Not Included") {
      // For EC types that have specific values like "10amp - Plug In"
      return <Check className="h-5 w-5 text-green-600" />;
    }
    return null;
  };

  // Inclusion items with their exact UI labels from docs/inclusions.md
  const inclusionItems = [
    { key: "a", label: "Locating underground services such as power, communication lines, sewer, stormwater, etc. (before, during and after construction) on the Site or any adjoining properties", type: "IE" },
    { key: "b", label: "Rerouting, relocating, reinstating, altering and/or repairing of existing underground power or services (before, during and after construction) on the Site", type: "IE" },
    { key: "c", label: "Rerouting, relocating, reinstating, altering and/or repairing of existing sewer and stormwater (before, during and after construction) on the Site", type: "IE" },
    { key: "d", label: "Seeking neighbours / council's consent for access", type: "IE" },
    { key: "e", label: "Removal of fences and/or any obstructions to machinery access unless specifically stated otherwise in this Contract", type: "IE" },
    { key: "f", label: "Removal of trees or other obstructions", type: "IE" },
    { key: "g", label: "Survey of the Site to confirm property boundaries, existing structures, house and pool location", type: "IE" },
    { key: "h", label: "Approval / provision / connection of or connection to a suitable sewer (often the relevant council wants connection to sewer)", type: "IE" },
    { key: "i", label: "Backwash / pump-out (for cartridge filters) water pipe in excess of 6 metres from filter", type: "IE" },
    { key: "j", label: "Geotechnical (soil test) and other engineering inspections and reports", type: "IE" },
    { key: "k", label: "Manual excavation", type: "IE" },
    { key: "l", label: "Mechanical excavation (not including removal from Site)", type: "IE" },
    { key: "m", label: "Fees for cartage of excavated material (See Provisional Allowance)", type: "IE" },
    { key: "n", label: "Fees for tipping of excavated material", type: "IE" },
    { key: "o", label: "Levelling or spreading excavated material on the Site or at a dumpsite", type: "IE" },
    { key: "p", label: "Excavation and/or disposal of additional overburden", type: "IE" },
    { key: "q", label: "Any work necessary to stabilise the Site conditions encountered in excavating and/or necessary to allow construction to proceed or recommence. This includes or covers events and consequences such as excavation collapsing due to unstable soil and/or the consequences of weather conditions such as rain and storms, and the use of pumps/spear pumps for de-watering if required.", type: "IE" },
    { key: "r", label: "Shoring of retaining walls or other stabilisation to ensure stability of overburden and/or pool excavation to protect adjacent structures and for safety of personnel", type: "IE" },
    { key: "s", label: "Surface protection", type: "IE" },
    { key: "t", label: "Concrete cutting of existing paving or structures – maximum depth 100 mm", type: "IE" },
    { key: "u", label: "Completing a pre-cut of the Site to level, including the disposal of pre-cut material", type: "IE" },
    { key: "v", label: "Excavation of rock, shale or other obstruction including removal from Site", type: "IE" },
    { key: "w", label: "Transportation of excavated earth from the Site to a dumpsite", type: "IE" },
    { key: "x", label: "Overcoming uncompacted fill and/or water table", type: "IE" },
    { key: "y", label: "Pumping to remove ground water", type: "IE" },
    { key: "z", label: "Electrical: Earth bond (from structural shell) supplied and installed by licensed electrician", type: "IE" },
    { key: "aa", label: "Electrical: Connection to mains (for heat pumps) supplied and installed by licensed electrician (payment by the Owner to the supplier directly – see Clauses 18.19 to 18.24)", type: "EC" },
    { key: "bb", label: "Electrical: Supply or connection to filtration, including earth bond, by licensed electrician (payment by the Owner to the supplier directly – see Clauses 12, 18.19 to 18.24)", type: "IE" },
    { key: "cc", label: "Temporary Pool Safety Barrier hire (liaising with third party only – payment by the Owner to the supplier directly – see Clauses 12, 18.1 to 18.9)", type: "IE" },
    { key: "dd", label: "Permanent pool safety barrier (liaising with third party only – payment by the Owner to the supplier directly – see Clauses 12, 18.10 to 18.18)", type: "IE" },
    { key: "ee", label: "Piering of structural beam around the pool (if required)", type: "IE" },
    { key: "ff", label: "Piering of extended paving (only required in some filled areas)", type: "IE" },
    { key: "gg", label: "Piering or other special structural requirements below existing structures or construction near a deep council sewer or storm-water pipe", type: "IE" },
    { key: "hh", label: "Concrete pump", type: "IE" },
    { key: "jj", label: "Replacement of fences and/or any obstructions to machinery access unless specifically stated within the Contract", type: "IE" },
    { key: "kk", label: "Removal of rubbish and wastage from pool install day", type: "IE" },
    { key: "ll", label: "Skip bin hire (only required for special circumstances)", type: "IE" },
    { key: "mm", label: "Full reinstatement of land, gardens, lawns, pathways, driveways and removal of spoil other than general cleaning and tidying (refer Schedule 4)", type: "IE" },
    { key: "nn", label: "Enclosures / sound-proofing of equipment", type: "IE" },
    { key: "oo", label: "Additional paperwork to alter position of filtration equipment from the position as noted in the pre-installation agreement", type: "IE" },
    { key: "pp", label: "Heating for the pool excluding connection to relevant services (such as gas, oil or electricity)", type: "IE" },
    { key: "qq", label: "The cost of overcoming any Latent Condition", type: "IE" },
    { key: "rr", label: "Water for filling pool", type: "IE" },
    { key: "ss", label: "Arranging fire-ant testing", type: "IE" },
    { key: "tt", label: "Cost of any testing, inspections or work required if fire-ants detected", type: "IE" },
    { key: "uu", label: "QBCC Home Warranty Insurance (cost is included in Contract Price)", type: "IE" },
  ] as const;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Included & Excluded Items (Schedule 3)</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Define what is included or excluded in the contract price. These specifications prevent disputes by clearly outlining the contractor's obligations and any additional costs that may apply.
        </p>
        
        <div className="grid gap-4">
          {inclusionItems.map(({ key, label, type }) => {
            const currentValue = data[key as keyof ContractInclusions] as string;
            return (
              <div key={key} className="grid gap-2 p-4 border rounded-lg">
                <Label htmlFor={key} className="text-sm leading-relaxed">
                  <span className="font-medium text-gray-500 mr-2">({key.toUpperCase()})</span>
                  {label}
                </Label>
                <div className="flex items-center gap-3">
                  <Select
                    value={currentValue}
                    onValueChange={(value) => handleFieldChange(key as keyof ContractInclusions, value)}
                    disabled={readonly}
                  >
                    <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed max-w-xs" : "max-w-xs"}>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {(type === "IE" ? IE_OPTIONS : EC_OPTIONS).map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex-shrink-0">
                    {getStatusIcon(currentValue)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {!readonly && (
          <div className="flex justify-end pt-4 border-t mt-6">
            <Button 
              onClick={onSave}
              className="min-w-[140px]"
            >
              Save Inclusions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};