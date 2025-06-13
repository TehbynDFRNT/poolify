import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shovel, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SitePreparationExcavation, R1_OPTIONS, R2_OPTIONS, R3_OPTIONS, S1_OPTIONS, EXCAVATOR_SIZE_OPTIONS } from "@/types/contract-qa";
import { useContractSiteDetails } from "@/components/contract/hooks/useContractSiteDetails";
import { useSearchParams } from "react-router-dom";

interface SitePreparationExcavationSectionProps {
  data?: SitePreparationExcavation; // Make optional since we'll manage state internally
  onChange?: (data: SitePreparationExcavation) => void; // Make optional
  readonly?: boolean;
  onSave?: () => void;
}

export const SitePreparationExcavationSection: React.FC<SitePreparationExcavationSectionProps> = ({
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
  const [formData, setFormData] = useState<SitePreparationExcavation>({
    treesOrWallsRemovalNeeded: "",
    overburdenRemovalResp: "",
    excavationRequiredBy: "",
    excavationMethod: "",
    excavatorComboSize: "",
    serviceLinesRelocationNeeded: "",
    serviceLinesRelocatedBy: "",
    excavatedMaterialLeftOnSite: "",
    excavatedMaterialRemoved: "",
    excavatedMaterialRemovedBy: "",
  });
  
  const { saveContractSiteDetails, loadContractSiteDetails, isSubmitting } = useContractSiteDetails();

  // Load site details data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading site preparation excavation for customer:', customerId);
        const existingData = await loadContractSiteDetails(customerId);
        
        if (existingData) {
          console.log('✅ Found existing site preparation excavation data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields
          const mappedData: SitePreparationExcavation = {
            treesOrWallsRemovalNeeded: existingData.afe_item_6_tree_removal || "",
            overburdenRemovalResp: existingData.afe_item_8_q1_overburden_preparation || "",
            excavationRequiredBy: existingData.afe_item_8_q2_excavation_required || "",
            excavationMethod: existingData.afe_item_8_q3_excavation_method || "",
            excavatorComboSize: existingData.afe_exc_combo_size || "",
            serviceLinesRelocationNeeded: existingData.afe_item_8_q4_service_relocation || "",
            serviceLinesRelocatedBy: existingData.afe_item_8_q5_service_relocation_party || "",
            excavatedMaterialLeftOnSite: existingData.afe_item_8_q6_material_left_on_site || "",
            excavatedMaterialRemoved: existingData.afe_item_8_q7_material_removed || "",
            excavatedMaterialRemovedBy: existingData.afe_item_8_q8_excavated_removal_party || "",
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing site preparation excavation data found - component will mount with empty form');
          setHasExistingRecord(false);
        }
      } catch (error) {
        console.warn('⚠️ Error loading site preparation excavation (component will mount with empty form):', error);
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

  const handleFieldChange = (field: keyof SitePreparationExcavation, value: any) => {
    // Update internal state
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!customerId) {
      console.error('No customer ID available');
      return;
    }

    try {
      // Map form fields to database fields using internal formData state
      const siteDetailsData = {
        afe_item_6_tree_removal: formData.treesOrWallsRemovalNeeded,
        afe_item_8_q1_overburden_preparation: formData.overburdenRemovalResp,
        afe_item_8_q2_excavation_required: formData.excavationRequiredBy,
        afe_item_8_q3_excavation_method: formData.excavationMethod,
        afe_exc_combo_size: formData.excavatorComboSize,
        afe_item_8_q4_service_relocation: formData.serviceLinesRelocationNeeded,
        afe_item_8_q5_service_relocation_party: formData.serviceLinesRelocatedBy,
        afe_item_8_q6_material_left_on_site: formData.excavatedMaterialLeftOnSite,
        afe_item_8_q7_material_removed: formData.excavatedMaterialRemoved,
        afe_item_8_q8_excavated_removal_party: formData.excavatedMaterialRemovedBy,
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
      console.error('Error saving site preparation excavation:', error);
    }
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
            <div className="flex justify-between items-start">
              <Label htmlFor="treesOrWallsRemovalNeeded" className="text-base font-medium">
                Trees / landscaping / walls require removal? <span className="text-destructive">*</span>
              </Label>
              {formData.treesOrWallsRemovalNeeded && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("treesOrWallsRemovalNeeded", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.treesOrWallsRemovalNeeded}
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
            <div className="flex justify-between items-start">
              <Label htmlFor="overburdenRemovalResp" className="text-base font-medium">Removal of over-burden & site prep</Label>
              {formData.overburdenRemovalResp && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("overburdenRemovalResp", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.overburdenRemovalResp}
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
            <div className="flex justify-between items-start">
              <Label htmlFor="excavationRequiredBy" className="text-base font-medium">Excavation required for pool</Label>
              {formData.excavationRequiredBy && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("excavationRequiredBy", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.excavationRequiredBy}
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
            <div className="flex justify-between items-start">
              <Label htmlFor="excavationMethod" className="text-base font-medium">
                Method of excavation <span className="text-destructive">*</span>
              </Label>
              {formData.excavationMethod && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("excavationMethod", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.excavationMethod}
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
            <div className="flex justify-between items-start">
              <Label htmlFor="excavatorComboSize" className="text-base font-medium">
                Excavator/Combo Size
              </Label>
              {formData.excavatorComboSize && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("excavatorComboSize", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.excavatorComboSize}
              onValueChange={(value) => handleFieldChange("excavatorComboSize", value)}
              disabled={readonly}
            >
              <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {EXCAVATOR_SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="serviceLinesRelocationNeeded" className="text-base font-medium">
                Do service lines (water, gas, sewer) need relocation? <span className="text-destructive">*</span>
              </Label>
              {formData.serviceLinesRelocationNeeded && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("serviceLinesRelocationNeeded", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.serviceLinesRelocationNeeded}
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
            <div className="flex justify-between items-start">
              <Label htmlFor="serviceLinesRelocatedBy" className="text-base font-medium">Party responsible for relocating service lines</Label>
              {formData.serviceLinesRelocatedBy && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("serviceLinesRelocatedBy", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.serviceLinesRelocatedBy}
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
            <div className="flex justify-between items-start">
              <Label htmlFor="excavatedMaterialLeftOnSite" className="text-base font-medium">
                Excavated material left on-site? <span className="text-destructive">*</span>
              </Label>
              {formData.excavatedMaterialLeftOnSite && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("excavatedMaterialLeftOnSite", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.excavatedMaterialLeftOnSite}
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
            <div className="flex justify-between items-start">
              <Label htmlFor="excavatedMaterialRemoved" className="text-base font-medium">
                Excavated material removed from site? <span className="text-destructive">*</span>
              </Label>
              {formData.excavatedMaterialRemoved && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("excavatedMaterialRemoved", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.excavatedMaterialRemoved}
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
            <div className="flex justify-between items-start">
              <Label htmlFor="excavatedMaterialRemovedBy" className="text-base font-medium">Party responsible for removal of excavated material</Label>
              {formData.excavatedMaterialRemovedBy && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("excavatedMaterialRemovedBy", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.excavatedMaterialRemovedBy}
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
              onClick={handleSave}
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? 
                (hasExistingRecord ? "Updating..." : "Saving...") : 
                (hasExistingRecord ? "Update Site Preparation & Excavation" : "Save Site Preparation & Excavation")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};