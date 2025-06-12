import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SurveyReference } from "@/types/contract-qa";
import { useContractSiteDetails } from "@/components/contract/hooks/useContractSiteDetails";
import { useSearchParams } from "react-router-dom";

interface SurveyReferenceSectionProps {
  data?: SurveyReference; // Make optional since we'll manage state internally
  onChange?: (data: SurveyReference) => void; // Make optional
  readonly?: boolean;
  onSave?: () => void;
}

export const SurveyReferenceSection: React.FC<SurveyReferenceSectionProps> = ({
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
  const [formData, setFormData] = useState<SurveyReference>({
    datumPoint: "",
  });
  
  const { saveContractSiteDetails, loadContractSiteDetails, isSubmitting } = useContractSiteDetails();

  // Load site details data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading survey reference for customer:', customerId);
        const existingData = await loadContractSiteDetails(customerId);
        
        if (existingData) {
          console.log('✅ Found existing survey reference data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields
          const mappedData: SurveyReference = {
            datumPoint: existingData.datum_point_mm || "",
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing survey reference data found - component will mount with empty form');
          setHasExistingRecord(false);
        }
      } catch (error) {
        console.warn('⚠️ Error loading survey reference (component will mount with empty form):', error);
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

  const handleFieldChange = (field: keyof SurveyReference, value: any) => {
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
        datum_point_mm: formData.datumPoint,
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
      console.error('Error saving survey reference:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Survey Reference</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Establish the elevation reference point for accurate pool positioning and water level calculations. The datum point ensures proper drainage and compliance with design specifications.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="datumPoint" className="text-base font-medium">Datum point (mm above/below AHD)</Label>
              {formData.datumPoint !== "" && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("datumPoint", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Input
              id="datumPoint"
              type="number"
              value={formData.datumPoint}
              onChange={readonly ? undefined : (e) => handleFieldChange("datumPoint", parseInt(e.target.value) || "")}
              placeholder="Enter datum point measurement"
              min="0"
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
                (hasExistingRecord ? "Update Survey Reference" : "Save Survey Reference")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};