import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { ExtraCostRiskFlags, R1_OPTIONS } from "@/types/contract-qa";
import { useContractExtraCosts } from "@/components/contract/hooks/useContractExtraCosts";
import { useSearchParams } from "react-router-dom";

interface ExtraCostRiskFlagsSectionProps {
  data?: ExtraCostRiskFlags; // Make optional since we'll manage state internally
  onChange?: (data: ExtraCostRiskFlags) => void; // Make optional
  readonly?: boolean;
  onSave?: () => void;
}

export const ExtraCostRiskFlagsSection: React.FC<ExtraCostRiskFlagsSectionProps> = ({
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
  const [formData, setFormData] = useState<ExtraCostRiskFlags>({
    locatingBoundaries: "",
    difficultAccess: "",
    ownerInterference: "",
    primeCostVariance: "",
    statutoryVariations: "",
    delayedProgress: "",
    latentConditions: "",
    suspensionCosts: "",
    excavatedFillCartage: "",
    productSubstitution: "",
    specialConditions: "",
    thirdPartyComponents: "",
  });
  
  const { saveContractExtraCosts, loadContractExtraCosts, isSubmitting } = useContractExtraCosts();

  // Load extra costs data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading extra costs data for customer:', customerId);
        const existingData = await loadContractExtraCosts(customerId);
        
        if (existingData) {
          console.log('✅ Found existing extra costs data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields
          const mappedData: ExtraCostRiskFlags = {
            locatingBoundaries: existingData.rfc_q1_siteboundaries || "",
            difficultAccess: existingData.rfc_q2_accessthesite || "",
            ownerInterference: existingData.rfc_q3_ownerinterference || "",
            primeCostVariance: existingData.rfc_q4_primecost_variance || "",
            statutoryVariations: existingData.rfc_q5_statutory_variations || "",
            delayedProgress: existingData.rfc_q6_commencement_delay || "",
            latentConditions: existingData.rfc_q7_latent_conditions || "",
            suspensionCosts: existingData.rfc_q8_works_suspension || "",
            excavatedFillCartage: existingData.rfc_q9_excavated_fill_dumping || "",
            productSubstitution: existingData.rfc_q10_product_substitution || "",
            specialConditions: existingData.rfc_total_special_conditions || "",
            thirdPartyComponents: existingData.third_party_components || "",
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing extra costs data found - component will mount with empty form');
          setHasExistingRecord(false);
        }
      } catch (error) {
        console.warn('⚠️ Error loading extra costs data (component will mount with empty form):', error);
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

  const handleFieldChange = (field: keyof ExtraCostRiskFlags, value: any) => {
    // Update internal state
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Check if all required fields are filled
  const isFormValid = () => {
    // All 12 fields are required
    const requiredFields = [
      formData.locatingBoundaries,
      formData.difficultAccess,
      formData.ownerInterference,
      formData.primeCostVariance,
      formData.statutoryVariations,
      formData.delayedProgress,
      formData.latentConditions,
      formData.suspensionCosts,
      formData.excavatedFillCartage,
      formData.productSubstitution,
      formData.specialConditions,
      formData.thirdPartyComponents,
    ];
    
    // Check if all required fields have values
    return requiredFields.every(field => field !== "");
  };

  const handleSave = async () => {
    if (!customerId) {
      console.error('No customer ID available');
      return;
    }

    try {
      // Map form fields to database fields using internal formData state
      const extraCostsData = {
        rfc_q1_siteboundaries: formData.locatingBoundaries,
        rfc_q2_accessthesite: formData.difficultAccess,
        rfc_q3_ownerinterference: formData.ownerInterference,
        rfc_q4_primecost_variance: formData.primeCostVariance,
        rfc_q5_statutory_variations: formData.statutoryVariations,
        rfc_q6_commencement_delay: formData.delayedProgress,
        rfc_q7_latent_conditions: formData.latentConditions,
        rfc_q8_works_suspension: formData.suspensionCosts,
        rfc_q9_excavated_fill_dumping: formData.excavatedFillCartage,
        rfc_q10_product_substitution: formData.productSubstitution,
        rfc_total_special_conditions: formData.specialConditions,
        third_party_components: formData.thirdPartyComponents,
      };

      const result = await saveContractExtraCosts(customerId, extraCostsData);
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
      console.error('Error saving extra costs data:', error);
    }
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
              <div className="flex justify-between items-start">
                <Label htmlFor={key} className="text-base font-medium">
                  {label} <span className="text-destructive">*</span>
                </Label>
                {formData[key as keyof ExtraCostRiskFlags] && !readonly && (
                  <button
                    type="button"
                    onClick={() => handleFieldChange(key as keyof ExtraCostRiskFlags, "")}
                    className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Remove Value
                  </button>
                )}
              </div>
              <Select
                value={formData[key as keyof ExtraCostRiskFlags]}
                onValueChange={(value) => handleFieldChange(key as keyof ExtraCostRiskFlags, value)}
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
              onClick={handleSave}
              disabled={isSubmitting || !isFormValid()}
              className="min-w-[140px]"
            >
              {isSubmitting ? 
                (hasExistingRecord ? "Updating..." : "Saving...") : 
                (hasExistingRecord ? "Update Extra Cost Risks" : "Save Extra Cost Risks")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};