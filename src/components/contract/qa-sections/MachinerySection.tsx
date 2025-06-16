import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContractSiteDetails } from "@/components/contract/hooks/useContractSiteDetails";
import { useSearchParams } from "react-router-dom";
import type { ProposalSnapshot } from "@/types/snapshot";

interface MachineryData {
  bobcatNeeded: string;
  bobcatSize: string;
  craneNeeded: string;
  craneSize: string;
  truckNeeded: string;
  trucksNumber: string;
  trucksSize: string;
  machineryNotes: string;
}

interface MachinerySectionProps {
  data?: MachineryData;
  onChange?: (data: MachineryData) => void;
  readonly?: boolean;
  onSave?: () => void;
  snapshot?: ProposalSnapshot | null;
}

export const MachinerySection: React.FC<MachinerySectionProps> = ({
  data: parentData,
  onChange: parentOnChange,
  readonly = false,
  onSave,
  snapshot,
}) => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('customerId');
  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Check if snapshot includes bobcat
  const hasBobcatInProposal = snapshot && snapshot.bobcat_cost > 0;
  const bobcatSizeFromProposal = snapshot?.bob_size_category && snapshot?.bob_day_code 
    ? `${snapshot.bob_size_category} - ${snapshot.bob_day_code}` 
    : snapshot?.bob_size_category || "";
  
  // Check if snapshot includes crane
  const hasCraneInProposal = snapshot && snapshot.crane_cost > 0;
  const craneSizeFromProposal = snapshot?.crn_name || "";
  
  // Check if snapshot includes trucks
  const hasTrucksInProposal = snapshot && snapshot.dig_truck_qty > 0;
  const trucksNumberFromProposal = snapshot?.dig_truck_qty?.toString() || "";
  
  // Manage form state internally
  const [formData, setFormData] = useState<MachineryData>({
    bobcatNeeded: hasBobcatInProposal ? "Yes" : "",
    bobcatSize: hasBobcatInProposal ? bobcatSizeFromProposal : "",
    craneNeeded: hasCraneInProposal ? "Yes" : "",
    craneSize: hasCraneInProposal ? craneSizeFromProposal : "",
    truckNeeded: hasTrucksInProposal ? "Yes" : "",
    trucksNumber: hasTrucksInProposal ? trucksNumberFromProposal : "",
    trucksSize: "",
    machineryNotes: "",
  });
  
  const { saveContractSiteDetails, loadContractSiteDetails, isSubmitting } = useContractSiteDetails();

  // Load site details data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading machinery data for customer:', customerId);
        const existingData = await loadContractSiteDetails(customerId);
        
        if (existingData) {
          console.log('✅ Found existing machinery data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields, but prioritize snapshot data for bobcat and crane fields
          const mappedData: MachineryData = {
            bobcatNeeded: hasBobcatInProposal ? "Yes" : (existingData.afe_item7_bobcat_needed || ""),
            bobcatSize: hasBobcatInProposal ? bobcatSizeFromProposal : (existingData.afe_item7_bobcat_size || ""),
            craneNeeded: hasCraneInProposal ? "Yes" : (existingData.afe_item7_crane_needed || ""),
            craneSize: hasCraneInProposal ? craneSizeFromProposal : (existingData.afe_item7_crane_size || ""),
            truckNeeded: hasTrucksInProposal ? "Yes" : (existingData.afe_item7_truck_needed || ""),
            trucksNumber: hasTrucksInProposal ? trucksNumberFromProposal : (existingData.afe_item7_trucks_num?.toString() || ""),
            trucksSize: existingData.afe_item7_trucks_size || "",
            machineryNotes: existingData.afe_item7_mach_notes || "",
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing machinery data found - component will mount with default values');
          setHasExistingRecord(false);
          // Use snapshot data as defaults when no existing data
          const defaultData: MachineryData = {
            bobcatNeeded: hasBobcatInProposal ? "Yes" : "",
            bobcatSize: hasBobcatInProposal ? bobcatSizeFromProposal : "",
            craneNeeded: hasCraneInProposal ? "Yes" : "",
            craneSize: hasCraneInProposal ? craneSizeFromProposal : "",
            truckNeeded: hasTrucksInProposal ? "Yes" : "",
            trucksNumber: hasTrucksInProposal ? trucksNumberFromProposal : "",
            trucksSize: "",
            machineryNotes: "",
          };
          setFormData(defaultData);
        }
      } catch (error) {
        console.warn('⚠️ Error loading machinery data (component will mount with empty values):', error);
        setHasExistingRecord(false);
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

  const handleFieldChange = (field: keyof MachineryData, value: string) => {
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
      // Map form fields to database fields
      const siteDetailsData = {
        afe_item7_bobcat_needed: formData.bobcatNeeded || null,
        afe_item7_bobcat_size: formData.bobcatSize || null,
        afe_item7_crane_needed: formData.craneNeeded || null,
        afe_item7_crane_size: formData.craneSize || null,
        afe_item7_truck_needed: formData.truckNeeded || null,
        afe_item7_trucks_num: formData.trucksNumber ? parseInt(formData.trucksNumber) : null,
        afe_item7_trucks_size: formData.trucksSize || null,
        afe_item7_mach_notes: formData.machineryNotes || null,
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
      console.error('Error saving machinery data:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Machinery</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Specify machinery requirements for this project including bobcat, crane, and truck needs.
        </p>
        
        <div className="grid gap-6">
          {/* Bobcat Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Bobcat</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Bobcat Needed</Label>
                  {formData.bobcatNeeded && !readonly && !hasBobcatInProposal && (
                    <button type="button" onClick={() => handleFieldChange("bobcatNeeded", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <Select value={formData.bobcatNeeded} onValueChange={(value) => handleFieldChange("bobcatNeeded", value)} disabled={readonly || hasBobcatInProposal}>
                  <SelectTrigger className={(readonly || hasBobcatInProposal) ? "bg-gray-50 cursor-not-allowed data-[disabled=true]:bg-gray-50 data-[disabled=true]:opacity-50" : ""}>
                    <SelectValue placeholder="Select if bobcat is needed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                {hasBobcatInProposal && (
                  <p className="text-xs text-gray-500">Proposal Includes Bobcat</p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Size of Bobcat</Label>
                  {formData.bobcatSize && !readonly && !hasBobcatInProposal && (
                    <button type="button" onClick={() => handleFieldChange("bobcatSize", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <Input
                  value={formData.bobcatSize}
                  onChange={readonly || hasBobcatInProposal ? undefined : (e) => handleFieldChange("bobcatSize", e.target.value)}
                  placeholder="Enter bobcat size"
                  readOnly={readonly || hasBobcatInProposal}
                  className={(readonly || hasBobcatInProposal) ? "bg-gray-50 cursor-not-allowed opacity-50" : ""}
                />
                {hasBobcatInProposal && (
                  <p className="text-xs text-gray-500">Proposal Includes Bobcat</p>
                )}
              </div>
            </div>
          </div>

          {/* Crane Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Crane</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Crane Needed</Label>
                  {formData.craneNeeded && !readonly && !hasCraneInProposal && (
                    <button type="button" onClick={() => handleFieldChange("craneNeeded", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <Select value={formData.craneNeeded} onValueChange={(value) => handleFieldChange("craneNeeded", value)} disabled={readonly || hasCraneInProposal}>
                  <SelectTrigger className={(readonly || hasCraneInProposal) ? "bg-gray-50 cursor-not-allowed data-[disabled=true]:bg-gray-50 data-[disabled=true]:opacity-50" : ""}>
                    <SelectValue placeholder="Select if crane is needed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                {hasCraneInProposal && (
                  <p className="text-xs text-gray-500">Proposal Includes Crane</p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Size of Crane</Label>
                  {formData.craneSize && !readonly && !hasCraneInProposal && (
                    <button type="button" onClick={() => handleFieldChange("craneSize", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <Input
                  value={formData.craneSize}
                  onChange={readonly || hasCraneInProposal ? undefined : (e) => handleFieldChange("craneSize", e.target.value)}
                  placeholder="Enter crane size"
                  readOnly={readonly || hasCraneInProposal}
                  className={(readonly || hasCraneInProposal) ? "bg-gray-50 cursor-not-allowed opacity-50" : ""}
                />
                {hasCraneInProposal && (
                  <p className="text-xs text-gray-500">Proposal Includes Crane</p>
                )}
              </div>
            </div>
          </div>

          {/* Trucks Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Trucks</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Trucks Needed</Label>
                  {formData.truckNeeded && !readonly && !hasTrucksInProposal && (
                    <button type="button" onClick={() => handleFieldChange("truckNeeded", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <Select value={formData.truckNeeded} onValueChange={(value) => handleFieldChange("truckNeeded", value)} disabled={readonly || hasTrucksInProposal}>
                  <SelectTrigger className={(readonly || hasTrucksInProposal) ? "bg-gray-50 cursor-not-allowed data-[disabled=true]:bg-gray-50 data-[disabled=true]:opacity-50" : ""}>
                    <SelectValue placeholder="Select if trucks are needed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
                {hasTrucksInProposal && (
                  <p className="text-xs text-gray-500">Proposal Includes Trucks</p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Number of Trucks</Label>
                  {formData.trucksNumber && !readonly && !hasTrucksInProposal && (
                    <button type="button" onClick={() => handleFieldChange("trucksNumber", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.trucksNumber}
                  onChange={readonly || hasTrucksInProposal ? undefined : (e) => handleFieldChange("trucksNumber", e.target.value)}
                  placeholder="Enter number of trucks"
                  readOnly={readonly || hasTrucksInProposal}
                  className={(readonly || hasTrucksInProposal) ? "bg-gray-50 cursor-not-allowed opacity-50" : ""}
                />
                {hasTrucksInProposal && (
                  <p className="text-xs text-gray-500">Proposal Includes Trucks</p>
                )}
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Size of Trucks</Label>
                  {formData.trucksSize && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("trucksSize", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <Select value={formData.trucksSize} onValueChange={(value) => handleFieldChange("trucksSize", value)} disabled={readonly}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select truck size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2 Metre">2 Metre</SelectItem>
                    <SelectItem value="6 Metre">6 Metre</SelectItem>
                    <SelectItem value="10 Metre">10 Metre</SelectItem>
                  </SelectContent>
                </Select>
                {hasTrucksInProposal && (
                  <p className="text-xs text-gray-500">Proposal Includes Trucks</p>
                )}
              </div>
            </div>
          </div>

          {/* Machinery Notes Section */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Machinery Notes</h4>
            <div className="grid gap-3">
              <div className="flex justify-between items-start">
                <Label className="text-sm font-medium">Additional Notes</Label>
                {formData.machineryNotes && !readonly && (
                  <button type="button" onClick={() => handleFieldChange("machineryNotes", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                    <X className="h-3 w-3" />
                    Clear
                  </button>
                )}
              </div>
              <Textarea
                value={formData.machineryNotes}
                onChange={readonly ? undefined : (e) => handleFieldChange("machineryNotes", e.target.value)}
                placeholder="Enter any additional machinery notes or requirements"
                readOnly={readonly}
                className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
                rows={4}
              />
            </div>
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
                (hasExistingRecord ? "Update Machinery" : "Save Machinery")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};