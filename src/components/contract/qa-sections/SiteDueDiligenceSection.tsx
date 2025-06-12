import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { SiteDueDiligenceNotes } from "@/types/contract-qa";
import { useContractSiteDetails } from "@/components/contract/hooks/useContractSiteDetails";
import { useSearchParams } from "react-router-dom";

interface SiteDueDiligenceSectionProps {
  data?: SiteDueDiligenceNotes; // Make optional since we'll manage state internally
  onChange?: (data: SiteDueDiligenceNotes) => void; // Make optional
  readonly?: boolean;
  onSave?: () => void;
}

export const SiteDueDiligenceSection: React.FC<SiteDueDiligenceSectionProps> = ({
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
  const [formData, setFormData] = useState<SiteDueDiligenceNotes>({
    mattersAffectingSiteByd: "",
    mattersAffectingSiteOwner: "",
  });
  
  const { saveContractSiteDetails, loadContractSiteDetails, isSubmitting } = useContractSiteDetails();

  // Load site details data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading site due diligence for customer:', customerId);
        const existingData = await loadContractSiteDetails(customerId);
        
        if (existingData) {
          console.log('✅ Found existing site due diligence data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields
          const mappedData: SiteDueDiligenceNotes = {
            mattersAffectingSiteByd: existingData.afe_item_1_description_1_byd_findings || "",
            mattersAffectingSiteOwner: existingData.afe_item_1_description_2_other_matters || "",
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing site due diligence data found - component will mount with empty form');
          setHasExistingRecord(false);
        }
      } catch (error) {
        console.warn('⚠️ Error loading site due diligence (component will mount with empty form):', error);
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

  const handleFieldChange = (field: keyof SiteDueDiligenceNotes, value: any) => {
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
        afe_item_1_description_1_byd_findings: formData.mattersAffectingSiteByd,
        afe_item_1_description_2_other_matters: formData.mattersAffectingSiteOwner,
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
      console.error('Error saving site due diligence:', error);
    }
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
            <div className="flex justify-between items-start">
              <Label htmlFor="mattersAffectingSiteByd" className="text-base font-medium">BYD / canibuild findings & reference numbers</Label>
              {formData.mattersAffectingSiteByd && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("mattersAffectingSiteByd", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Textarea
              id="mattersAffectingSiteByd"
              value={formData.mattersAffectingSiteByd}
              onChange={readonly ? undefined : (e) => handleFieldChange("mattersAffectingSiteByd", e.target.value)}
              placeholder="Enter findings from Before You Dig and canibuild investigations, including reference numbers"
              rows={4}
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="mattersAffectingSiteOwner" className="text-base font-medium">Other matters the owner is aware of</Label>
              {formData.mattersAffectingSiteOwner && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("mattersAffectingSiteOwner", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Textarea
              id="mattersAffectingSiteOwner"
              value={formData.mattersAffectingSiteOwner}
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
              onClick={handleSave}
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? 
                (hasExistingRecord ? "Updating..." : "Saving...") : 
                (hasExistingRecord ? "Update Site Due Diligence" : "Save Site Due Diligence")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};