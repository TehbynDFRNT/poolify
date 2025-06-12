import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Users, X } from "lucide-react";
import { Responsibilities, R2_OPTIONS } from "@/types/contract-qa";
import { useContractSiteDetails } from "@/components/contract/hooks/useContractSiteDetails";
import { useSearchParams } from "react-router-dom";

interface ResponsibilitiesSectionProps {
  data?: Responsibilities; // Make optional since we'll manage state internally
  onChange?: (data: Responsibilities) => void; // Make optional
  readonly?: boolean;
  onSave?: () => void;
}

export const ResponsibilitiesSection: React.FC<ResponsibilitiesSectionProps> = ({
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
  const [formData, setFormData] = useState<Responsibilities>({
    fenceRemovalBy: "",
    fenceReinstatementBy: "",
    treeRemovalBy: "",
    treeReinstatementBy: "",
  });
  
  const { saveContractSiteDetails, loadContractSiteDetails, isSubmitting } = useContractSiteDetails();

  // Load site details data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading responsibilities for customer:', customerId);
        const existingData = await loadContractSiteDetails(customerId);
        
        if (existingData) {
          console.log('✅ Found existing responsibilities data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields
          const mappedData: Responsibilities = {
            fenceRemovalBy: existingData.afe_item_4_rfm_removal_party || "",
            fenceReinstatementBy: existingData.afe_item_4_rrf_reinstatement_party || "",
            treeRemovalBy: existingData.afe_item_6_tree_removal_party || "",
            treeReinstatementBy: existingData.afe_item_6_tree_replacement_party || "",
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing responsibilities data found - component will mount with empty form');
          setHasExistingRecord(false);
        }
      } catch (error) {
        console.warn('⚠️ Error loading responsibilities (component will mount with empty form):', error);
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

  const handleFieldChange = (field: keyof Responsibilities, value: any) => {
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
        afe_item_4_rfm_removal_party: formData.fenceRemovalBy,
        afe_item_4_rrf_reinstatement_party: formData.fenceReinstatementBy,
        afe_item_6_tree_removal_party: formData.treeRemovalBy,
        afe_item_6_tree_replacement_party: formData.treeReinstatementBy,
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
      console.error('Error saving responsibilities:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Responsibilities – Fencing, Trees, etc.</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Clearly define who is responsible for removing and reinstating existing structures like fences, trees, and landscaping. This prevents disputes about scope of work and associated costs.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="fenceRemovalBy" className="text-base font-medium">Party responsible for removing fences</Label>
              {formData.fenceRemovalBy && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("fenceRemovalBy", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.fenceRemovalBy}
              onValueChange={(value) => handleFieldChange("fenceRemovalBy", value)}
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
              <Label htmlFor="fenceReinstatementBy" className="text-base font-medium">Party responsible for reinstating fences</Label>
              {formData.fenceReinstatementBy && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("fenceReinstatementBy", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.fenceReinstatementBy}
              onValueChange={(value) => handleFieldChange("fenceReinstatementBy", value)}
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
              <Label htmlFor="treeRemovalBy" className="text-base font-medium">Party responsible for removing trees / landscaping / walls</Label>
              {formData.treeRemovalBy && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("treeRemovalBy", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.treeRemovalBy}
              onValueChange={(value) => handleFieldChange("treeRemovalBy", value)}
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
              <Label htmlFor="treeReinstatementBy" className="text-base font-medium">Party responsible for reinstating trees / landscaping / walls</Label>
              {formData.treeReinstatementBy && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("treeReinstatementBy", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.treeReinstatementBy}
              onValueChange={(value) => handleFieldChange("treeReinstatementBy", value)}
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
                (hasExistingRecord ? "Update Responsibilities" : "Save Responsibilities")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};