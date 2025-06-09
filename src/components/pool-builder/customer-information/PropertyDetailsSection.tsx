
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Home } from "lucide-react";

interface PropertyDetailsSectionProps {
  homeAddress: string;
  setHomeAddress: (value: string) => void;
  siteAddress: string;
  setSiteAddress: (value: string) => void;
  installationArea: string;
  setInstallationArea: (value: string) => void;
  isResidentHomeowner: boolean;
  setIsResidentHomeowner: (value: boolean) => void;
  readonly?: boolean;
}

const INSTALLATION_AREAS = [
  "Brisbane",
  "Gold Coast",
  "Sunshine Coast",
  "Ipswich",
  "Logan",
  "Toowoomba",
  "Other"
];

const PropertyDetailsSection: React.FC<PropertyDetailsSectionProps> = ({
  homeAddress,
  setHomeAddress,
  siteAddress,
  setSiteAddress,
  installationArea,
  setInstallationArea,
  isResidentHomeowner,
  setIsResidentHomeowner,
  readonly = false,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Home className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Property Details</h3>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="homeAddress">Home Address <span className="text-destructive">*</span></Label>
            <Input
              id="homeAddress"
              value={homeAddress}
              onChange={readonly ? undefined : (e) => setHomeAddress(e.target.value)}
              placeholder="Home Address"
              required
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="siteAddress">
              Site Address <span className="text-muted-foreground text-sm">(if different from home address)</span>
            </Label>
            <Input
              id="siteAddress"
              value={siteAddress}
              onChange={readonly ? undefined : (e) => setSiteAddress(e.target.value)}
              placeholder="Site Address (optional)"
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="installationArea">Installation Area <span className="text-destructive">*</span></Label>
            {readonly ? (
              <Input
                id="installationArea"
                value={installationArea}
                readOnly
                className="bg-gray-50 cursor-not-allowed"
              />
            ) : (
              <Select 
                value={installationArea} 
                onValueChange={setInstallationArea}
              >
                <SelectTrigger id="installationArea">
                  <SelectValue placeholder="Select installation area" />
                </SelectTrigger>
                <SelectContent>
                  {INSTALLATION_AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Label htmlFor="residentHomeowner" className="cursor-pointer">Resident Homeowner</Label>
            <Switch
              id="residentHomeowner"
              checked={isResidentHomeowner}
              onCheckedChange={readonly ? undefined : setIsResidentHomeowner}
              disabled={readonly}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyDetailsSection;
