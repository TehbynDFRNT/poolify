import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccessSiteConditions, R1_OPTIONS } from "@/types/contract-qa";
import { useContractSiteDetails } from "@/components/contract/hooks/useContractSiteDetails";
import { useSearchParams } from "react-router-dom";

interface AccessSiteConditionsSectionProps {
  data?: AccessSiteConditions; // Make optional since we'll manage state internally
  onChange?: (data: AccessSiteConditions) => void; // Make optional
  readonly?: boolean;
  onSave?: () => void;
}

export const AccessSiteConditionsSection: React.FC<AccessSiteConditionsSectionProps> = ({
  data: parentData,
  onChange: parentOnChange,
  readonly = false,
  onSave,
}) => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('customerId');
  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Manage form state internally
  const [formData, setFormData] = useState<AccessSiteConditions>({
    accessVideoProvided: "",
    minAccessWidthMm: "",
    minAccessHeightMm: "",
    craneRequired: "",
    minCraneClearanceMm: "",
    fencesInAccessPath: "",
  });
  
  const { saveContractSiteDetails, loadContractSiteDetails, isSubmitting } = useContractSiteDetails();

  // Load site details data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading access site conditions for customer:', customerId);
        const existingData = await loadContractSiteDetails(customerId);
        
        if (existingData) {
          console.log('✅ Found existing access site conditions data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields
          const mappedData: AccessSiteConditions = {
            accessVideoProvided: existingData.afe_item_2_sketch_provided || "",
            minAccessWidthMm: existingData.afe_min_access_width_mm || "",
            minAccessHeightMm: existingData.afe_min_access_height_mm || "",
            craneRequired: existingData.afe_crane_required || "",
            minCraneClearanceMm: existingData.afe_min_crane_clearance_mm || "",
            fencesInAccessPath: existingData.afe_item_4_fnp_fences_near_access_path || "",
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing access site conditions data found - component will mount with empty form');
          setHasExistingRecord(false);
        }
      } catch (error) {
        console.warn('⚠️ Error loading access site conditions (component will mount with empty form):', error);
        setHasExistingRecord(false);
        // Don't throw error - just continue with empty form
      } finally {
        setIsInitialized(true);
      }
    };

    loadData();
  }, [customerId, isInitialized]);

  // Reset initialization state on unmount
  useEffect(() => {
    return () => {
      setIsInitialized(false);
    };
  }, []);

  const handleFieldChange = (field: keyof AccessSiteConditions, value: any) => {
    // Update internal state
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value,
      };
      
      // If crane is not required, clear the crane clearance field
      if (field === "craneRequired" && value !== "Yes") {
        newData.minCraneClearanceMm = "";
      }
      
      return newData;
    });
  };

  const handleSave = async () => {
    if (!customerId) {
      console.error('No customer ID available');
      return;
    }

    try {
      // Map form fields to database fields using internal formData state
      // Always include crane clearance field so it gets nullified when crane not required
      const siteDetailsData = {
        afe_item_2_sketch_provided: formData.accessVideoProvided,
        afe_min_access_width_mm: formData.minAccessWidthMm,
        afe_min_access_height_mm: formData.minAccessHeightMm,
        afe_crane_required: formData.craneRequired,
        afe_min_crane_clearance_mm: formData.craneRequired === "Yes" ? formData.minCraneClearanceMm : "",
        afe_item_4_fnp_fences_near_access_path: formData.fencesInAccessPath,
      };

      const result = await saveContractSiteDetails(customerId, siteDetailsData);
      if (result && !hasExistingRecord) {
        setHasExistingRecord(true);
      }
      
      // Update parent with saved data if onChange is provided
      if (parentOnChange) {
        parentOnChange(formData);
      }
      
      // Call the original onSave callback if provided
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving access site conditions:', error);
    }
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
            <div className="flex justify-between items-start">
              <Label htmlFor="accessVideoProvided" className="text-base font-medium">
                Animated video / sketch of access path provided? <span className="text-destructive">*</span>
              </Label>
              {formData.accessVideoProvided && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("accessVideoProvided", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.accessVideoProvided}
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
            <div className="flex justify-between items-start">
              <Label htmlFor="minAccessWidthMm" className="text-base font-medium">
                Minimum access width (mm) <span className="text-destructive">*</span>
              </Label>
              {formData.minAccessWidthMm !== "" && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("minAccessWidthMm", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Input
              id="minAccessWidthMm"
              type="number"
              value={formData.minAccessWidthMm}
              onChange={readonly ? undefined : (e) => handleFieldChange("minAccessWidthMm", parseInt(e.target.value) || "")}
              placeholder="Width in millimeters"
              min="1"
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="minAccessHeightMm" className="text-base font-medium">
                Minimum access height (mm) <span className="text-destructive">*</span>
              </Label>
              {formData.minAccessHeightMm !== "" && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("minAccessHeightMm", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Input
              id="minAccessHeightMm"
              type="number"
              value={formData.minAccessHeightMm}
              onChange={readonly ? undefined : (e) => handleFieldChange("minAccessHeightMm", parseInt(e.target.value) || "")}
              placeholder="Height in millimeters"
              min="1"
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="craneRequired" className="text-base font-medium">
                Is a crane required? <span className="text-destructive">*</span>
              </Label>
              {formData.craneRequired && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("craneRequired", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.craneRequired}
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

          {formData.craneRequired === "Yes" && (
            <div className="grid gap-3">
              <div className="flex justify-between items-start">
                <Label htmlFor="minCraneClearanceMm" className="text-base font-medium">
                  Minimum crane clearance (mm) <span className="text-destructive">*</span>
                </Label>
                {formData.minCraneClearanceMm !== "" && !readonly && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange("minCraneClearanceMm", "")}
                    className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Remove Value
                  </button>
                )}
              </div>
              <Input
                id="minCraneClearanceMm"
                type="number"
                value={formData.minCraneClearanceMm}
                onChange={readonly ? undefined : (e) => handleFieldChange("minCraneClearanceMm", parseInt(e.target.value) || "")}
                placeholder="Clearance in millimeters"
                min="1"
                readOnly={readonly}
                className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
              />
            </div>
          )}

          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="fencesInAccessPath" className="text-base font-medium">
                Are fences in / near the access path? <span className="text-destructive">*</span>
              </Label>
              {formData.fencesInAccessPath && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("fencesInAccessPath", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.fencesInAccessPath}
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
              onClick={handleSave}
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? 
                (hasExistingRecord ? "Updating..." : "Saving...") : 
                (hasExistingRecord ? "Update Access & Site Conditions" : "Save Access & Site Conditions")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};