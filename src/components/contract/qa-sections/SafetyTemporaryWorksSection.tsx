import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Shield, X } from "lucide-react";
import { SafetyTemporaryWorks, R1_OPTIONS, R5_OPTIONS } from "@/types/contract-qa";
import { useContractSafety } from "@/components/contract/hooks/useContractSafety";
import { useSearchParams } from "react-router-dom";

interface SafetyTemporaryWorksSectionProps {
  data?: SafetyTemporaryWorks; // Make optional since we'll manage state internally
  onChange?: (data: SafetyTemporaryWorks) => void; // Make optional
  readonly?: boolean;
  onSave?: () => void;
}

export const SafetyTemporaryWorksSection: React.FC<SafetyTemporaryWorksSectionProps> = ({
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
  const [formData, setFormData] = useState<SafetyTemporaryWorks>({
    tempPoolSafetyBarrier: "",
    tempSafetyBarrierType: "",
    tempSafetyBarrierHirePeriodWeeks: "",
    powerConnectionProvided: "",
    hardCoverRequired: "",
    permPoolSafetyBarrier: "",
    tempFenceProvided: "",
  });
  
  const { saveContractSafety, loadContractSafety, isSubmitting } = useContractSafety();

  // Load safety data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading safety data for customer:', customerId);
        const existingData = await loadContractSafety(customerId);
        
        if (existingData) {
          console.log('✅ Found existing safety data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields
          const mappedData: SafetyTemporaryWorks = {
            tempPoolSafetyBarrier: existingData.tpc_tpsb || "",
            tempSafetyBarrierType: existingData.tpc_temporary_barrier_type || "",
            tempSafetyBarrierHirePeriodWeeks: existingData.tpc_temp_barrier_hire_period_weeks || "",
            powerConnectionProvided: existingData.tpc_power_connection || "",
            hardCoverRequired: existingData.tpc_hardcover || "",
            permPoolSafetyBarrier: existingData.tpc_ppsb || "",
            tempFenceProvided: existingData.tpc_temp_fence || "",
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing safety data found - component will mount with empty form');
          setHasExistingRecord(false);
        }
      } catch (error) {
        console.warn('⚠️ Error loading safety data (component will mount with empty form):', error);
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

  const handleFieldChange = (field: keyof SafetyTemporaryWorks, value: any) => {
    // Update internal state
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value,
      };
      
      // If temp pool safety barrier is not "Yes", clear the barrier type and hire period fields
      if (field === "tempPoolSafetyBarrier" && value !== "Yes") {
        newData.tempSafetyBarrierType = "";
        newData.tempSafetyBarrierHirePeriodWeeks = "";
      }
      
      return newData;
    });
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    // All main fields are required
    const requiredFields = [
      formData.tempPoolSafetyBarrier,
      formData.powerConnectionProvided,
      formData.hardCoverRequired,
      formData.permPoolSafetyBarrier,
      formData.tempFenceProvided
    ];
    
    // Check if all required fields have values
    const allFieldsFilled = requiredFields.every(field => field !== "");
    
    // If temp pool safety barrier is "Yes", then barrier type is also required
    if (formData.tempPoolSafetyBarrier === "Yes" && formData.tempSafetyBarrierType === "") {
      return false;
    }
    
    return allFieldsFilled;
  };

  const handleSave = async () => {
    if (!customerId) {
      console.error('No customer ID available');
      return;
    }

    try {
      // Map form fields to database fields using internal formData state
      // Always include barrier type and hire period fields so they get nullified when barrier not required
      const safetyData = {
        tpc_tpsb: formData.tempPoolSafetyBarrier,
        tpc_temporary_barrier_type: formData.tempPoolSafetyBarrier === "Yes" ? formData.tempSafetyBarrierType : "",
        tpc_temp_barrier_hire_period_weeks: formData.tempPoolSafetyBarrier === "Yes" ? formData.tempSafetyBarrierHirePeriodWeeks : "",
        tpc_power_connection: formData.powerConnectionProvided,
        tpc_hardcover: formData.hardCoverRequired,
        tpc_ppsb: formData.permPoolSafetyBarrier,
        tpc_temp_fence: formData.tempFenceProvided,
      };

      const result = await saveContractSafety(customerId, safetyData);
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
      console.error('Error saving safety data:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Third Party Components</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Define components and services provided by third party contractors, including safety barriers, power connections, and protective covers. These elements are typically sourced externally and require clear responsibility allocation.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="tempPoolSafetyBarrier" className="text-base font-medium">
                Temporary pool safety barrier required? <span className="text-destructive">*</span>
              </Label>
              {formData.tempPoolSafetyBarrier && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("tempPoolSafetyBarrier", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.tempPoolSafetyBarrier}
              onValueChange={(value) => handleFieldChange("tempPoolSafetyBarrier", value)}
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

          {formData.tempPoolSafetyBarrier === "Yes" && (
            <div className="grid gap-3">
              <div className="flex justify-between items-start">
                <Label htmlFor="tempSafetyBarrierType" className="text-base font-medium">
                  Type of temporary safety barrier <span className="text-destructive">*</span>
                </Label>
                {formData.tempSafetyBarrierType && !readonly && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange("tempSafetyBarrierType", "")}
                    className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Remove Value
                  </button>
                )}
              </div>
              <Select
                value={formData.tempSafetyBarrierType}
                onValueChange={(value) => handleFieldChange("tempSafetyBarrierType", value)}
                disabled={readonly}
              >
                <SelectTrigger className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {R5_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.tempPoolSafetyBarrier === "Yes" && (
            <div className="grid gap-3">
              <div className="flex justify-between items-start">
                <Label htmlFor="tempSafetyBarrierHirePeriodWeeks" className="text-base font-medium">
                  Temporary safety barrier hire period (weeks):
                </Label>
                {formData.tempSafetyBarrierHirePeriodWeeks !== "" && !readonly && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange("tempSafetyBarrierHirePeriodWeeks", "")}
                    className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Remove Value
                  </button>
                )}
              </div>
              <Input
                id="tempSafetyBarrierHirePeriodWeeks"
                type="number"
                value={formData.tempSafetyBarrierHirePeriodWeeks}
                onChange={readonly ? undefined : (e) => handleFieldChange("tempSafetyBarrierHirePeriodWeeks", parseInt(e.target.value) || "")}
                placeholder="Number of weeks"
                min="1"
                step="1"
                readOnly={readonly}
                className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
              />
            </div>
          )}

          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="powerConnectionProvided" className="text-base font-medium">
                Power connection (temp‐works) <span className="text-destructive">*</span>
              </Label>
              {formData.powerConnectionProvided && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("powerConnectionProvided", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.powerConnectionProvided}
              onValueChange={(value) => handleFieldChange("powerConnectionProvided", value)}
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
              <Label htmlFor="hardCoverRequired" className="text-base font-medium">
                Hard cover over pool shell required? <span className="text-destructive">*</span>
              </Label>
              {formData.hardCoverRequired && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("hardCoverRequired", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.hardCoverRequired}
              onValueChange={(value) => handleFieldChange("hardCoverRequired", value)}
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
              <Label htmlFor="permPoolSafetyBarrier" className="text-base font-medium">
                Permanent pool safety barrier included? <span className="text-destructive">*</span>
              </Label>
              {formData.permPoolSafetyBarrier && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("permPoolSafetyBarrier", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.permPoolSafetyBarrier}
              onValueChange={(value) => handleFieldChange("permPoolSafetyBarrier", value)}
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
              <Label htmlFor="tempFenceProvided" className="text-base font-medium">
                Temporary fence supplied? <span className="text-destructive">*</span>
              </Label>
              {formData.tempFenceProvided && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("tempFenceProvided", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.tempFenceProvided}
              onValueChange={(value) => handleFieldChange("tempFenceProvided", value)}
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
              disabled={isSubmitting || !isFormValid()}
              className="min-w-[140px]"
            >
              {isSubmitting ? 
                (hasExistingRecord ? "Updating..." : "Saving...") : 
                (hasExistingRecord ? "Update Third Party Components" : "Save Third Party Components")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};