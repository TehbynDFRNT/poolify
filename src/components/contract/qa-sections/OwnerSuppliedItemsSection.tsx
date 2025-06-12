import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Package, X } from "lucide-react";
import { OwnerSuppliedItems } from "@/types/contract-qa";
import { useContractSpecialWork } from "@/components/contract/hooks/useContractSpecialWork";
import { useSearchParams } from "react-router-dom";

interface OwnerSuppliedItemsSectionProps {
  data?: OwnerSuppliedItems; // Make optional since we'll manage state internally
  onChange?: (data: OwnerSuppliedItems) => void; // Make optional
  readonly?: boolean;
  onSave?: () => void;
}

export const OwnerSuppliedItemsSection: React.FC<OwnerSuppliedItemsSectionProps> = ({
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
  const [formData, setFormData] = useState<OwnerSuppliedItems>({
    ownerSuppliedItem1: "",
    ownerSuppliedItem2: "",
  });
  
  const { saveContractSpecialWork, loadContractSpecialWork, isSubmitting } = useContractSpecialWork();

  // Load owner supplied items data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading owner supplied items data for customer:', customerId);
        const existingData = await loadContractSpecialWork(customerId);
        
        if (existingData) {
          console.log('✅ Found existing owner supplied items data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields
          const mappedData: OwnerSuppliedItems = {
            ownerSuppliedItem1: existingData.c_item_17_osi_description_1 || "",
            ownerSuppliedItem2: existingData.c_item_17_osi_description_2 || "",
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing owner supplied items data found - component will mount with empty form');
          setHasExistingRecord(false);
        }
      } catch (error) {
        console.warn('⚠️ Error loading owner supplied items data (component will mount with empty form):', error);
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

  const handleFieldChange = (field: keyof OwnerSuppliedItems, value: any) => {
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
        c_item_17_osi_description_1: formData.ownerSuppliedItem1,
        c_item_17_osi_description_2: formData.ownerSuppliedItem2,
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
      console.error('Error saving owner supplied items data:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Owner-Supplied Items</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Record any materials, equipment, or components that the property owner will provide for the pool construction. This clarifies what items are excluded from the contractor's supply obligations.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="ownerSuppliedItem1" className="text-base font-medium">
                Owner-supplied item #1
              </Label>
              {formData.ownerSuppliedItem1 && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("ownerSuppliedItem1", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Input
              id="ownerSuppliedItem1"
              value={formData.ownerSuppliedItem1}
              onChange={readonly ? undefined : (e) => handleFieldChange("ownerSuppliedItem1", e.target.value)}
              placeholder="Description of first owner-supplied item"
              maxLength={150}
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="ownerSuppliedItem2" className="text-base font-medium">
                Owner-supplied item #2
              </Label>
              {formData.ownerSuppliedItem2 && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("ownerSuppliedItem2", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Input
              id="ownerSuppliedItem2"
              value={formData.ownerSuppliedItem2}
              onChange={readonly ? undefined : (e) => handleFieldChange("ownerSuppliedItem2", e.target.value)}
              placeholder="Description of second owner-supplied item"
              maxLength={150}
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
                (hasExistingRecord ? "Update Owner Supplied Items" : "Save Owner Supplied Items")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};