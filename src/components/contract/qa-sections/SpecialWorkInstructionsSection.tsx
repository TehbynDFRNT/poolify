import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SpecialWorkInstructions } from "@/types/contract-qa";
import { useContractSpecialWork } from "@/components/contract/hooks/useContractSpecialWork";
import { useSearchParams } from "react-router-dom";

interface SpecialWorkInstructionsSectionProps {
  data?: SpecialWorkInstructions; // Make optional since we'll manage state internally
  onChange?: (data: SpecialWorkInstructions) => void; // Make optional
  readonly?: boolean;
  onSave?: () => void;
}

export const SpecialWorkInstructionsSection: React.FC<SpecialWorkInstructionsSectionProps> = ({
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
  const [formData, setFormData] = useState<SpecialWorkInstructions>({
    specialConsiderations: "",
    extraOrSpecialWork: "",
    specialAccess: "",
    specialAccessNotes: "",
  });
  
  const { saveContractSpecialWork, loadContractSpecialWork, isSubmitting } = useContractSpecialWork();

  // Load special work data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading special work data for customer:', customerId);
        const existingData = await loadContractSpecialWork(customerId);
        
        if (existingData) {
          console.log('✅ Found existing special work data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields
          const mappedData: SpecialWorkInstructions = {
            specialConsiderations: existingData.special_considerations || "",
            extraOrSpecialWork: existingData.extra_special_notes || "",
            specialAccess: existingData.special_access || "",
            specialAccessNotes: existingData.special_access_notes || "",
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing special work data found - component will mount with empty form');
          setHasExistingRecord(false);
        }
      } catch (error) {
        console.warn('⚠️ Error loading special work data (component will mount with empty form):', error);
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

  const handleFieldChange = (field: keyof SpecialWorkInstructions, value: any) => {
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
      const specialWorkData = {
        special_considerations: formData.specialConsiderations,
        extra_special_notes: formData.extraOrSpecialWork,
        special_access: formData.specialAccess,
        special_access_notes: formData.specialAccessNotes,
      };

      const result = await saveContractSpecialWork(customerId, specialWorkData);
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
      console.error('Error saving special work data:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Special Work & Conditions</h3>
        </div>
        
        <div className="space-y-8">
          {/* Schedule 1 - Special Conditions Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Schedule 1 - SPECIAL CONDITIONS</h4>
            <p className="text-sm text-gray-600">
              Refer to ADDENDUM, titled 'SPECIAL CONDITIONS'
            </p>
            <div className="grid gap-3">
              <div className="flex justify-between items-start">
                <Label htmlFor="specialConsiderations" className="text-base font-medium">
                  Special Considerations
                </Label>
                {formData.specialConsiderations && !readonly && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange("specialConsiderations", "")}
                    className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Remove Value
                  </button>
                )}
              </div>
              <Textarea
                id="specialConsiderations"
                value={formData.specialConsiderations}
                onChange={readonly ? undefined : (e) => handleFieldChange("specialConsiderations", e.target.value)}
                placeholder="Enter special considerations as referenced in the addendum"
                rows={6}
                readOnly={readonly}
                className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
              />
            </div>
          </div>

          {/* Schedule 6 - Special Work / Miscellaneous Equipment Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Schedule 6 - SPECIAL WORK / MISCELLANEOUS EQUIPMENT</h4>
            <p className="text-sm text-gray-600">
              Extra of special work to be carried out, or materials or equipment to be supplied or included in the Contract Price, is detailed below:
            </p>
            <div className="grid gap-3">
              <div className="flex justify-between items-start">
                <Label htmlFor="extraOrSpecialWork" className="text-base font-medium">
                  Extra or Special Work Details
                </Label>
                {formData.extraOrSpecialWork && !readonly && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange("extraOrSpecialWork", "")}
                    className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Remove Value
                  </button>
                )}
              </div>
              <Textarea
                id="extraOrSpecialWork"
                value={formData.extraOrSpecialWork}
                onChange={readonly ? undefined : (e) => handleFieldChange("extraOrSpecialWork", e.target.value)}
                placeholder="Enter details of extra or special work to be carried out, or materials/equipment to be supplied or included in the Contract Price"
                rows={6}
                readOnly={readonly}
                className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
              />
            </div>
          </div>

          {/* Schedule 8 - Additional Access Work / Organisation Required Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Schedule 8 - ADDITIONAL ACCESS WORK / ORGANISATION REQUIRED</h4>
            <p className="text-sm text-gray-600">
              This includes fences to be taken down, items to be moved for access, and arranging for use of neighbour's land including council land.
            </p>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label htmlFor="specialAccess" className="text-base font-medium">
                    Special Access Required
                  </Label>
                  {formData.specialAccess && !readonly && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange("specialAccess", "")}
                      className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <Select value={formData.specialAccess} onValueChange={(value) => {
                  handleFieldChange("specialAccess", value);
                  // Clear notes when "No" is selected
                  if (value === "No") {
                    handleFieldChange("specialAccessNotes", "");
                  }
                }} disabled={readonly}>
                  <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                    <SelectValue placeholder="Select if special access is required" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.specialAccess === "Yes" && (
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label htmlFor="specialAccessNotes" className="text-base font-medium">
                    Special Access Notes
                  </Label>
                  {formData.specialAccessNotes && !readonly && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange("specialAccessNotes", "")}
                      className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      Remove Value
                    </button>
                  )}
                </div>
                <Textarea
                  id="specialAccessNotes"
                  value={formData.specialAccessNotes}
                  onChange={readonly ? undefined : (e) => handleFieldChange("specialAccessNotes", e.target.value)}
                  placeholder="Enter details about special access requirements"
                  rows={4}
                  readOnly={readonly}
                  className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
                />
              </div>
              )}
            </div>
          </div>
        </div>
        
        {!readonly && (
          <div className="flex justify-end pt-4 border-t mt-8">
            <Button 
              onClick={handleSave}
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? 
                (hasExistingRecord ? "Updating..." : "Saving...") : 
                (hasExistingRecord ? "Update Special Work Instructions" : "Save Special Work Instructions")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};