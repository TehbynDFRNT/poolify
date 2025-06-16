import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DollarSign, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContractSiteDetails } from "@/components/contract/hooks/useContractSiteDetails";
import { useSearchParams } from "react-router-dom";
import type { ProposalSnapshot } from "@/types/snapshot";
import type { PriceCalculatorResult } from "@/hooks/calculations/use-calculator-totals";

interface MinimumHireCharges {
  excavatorRatePerHour: number | "";
  excavatorMinimumCharge: number | "";
  truckRatePerHour: number | "";
  truckMinimumCharge: number | "";
  rockRatePerHour: number | "";
  rockMinimumCharge: number | "";
  cartageRatePerHour: number | "";
  cartageMinimumCharge: number | "";
  pipeRatePerHour: number | "";
  pipeMinimumCharge: number | "";
  supervisoryRatePerHour: number | "";
  supervisoryMinimumCharge: number | "";
  bobcatRatePerHour: number | "";
  bobcatMinimumCharge: number | "";
}

interface MinimumHireChargesSectionProps {
  data?: MinimumHireCharges;
  onChange?: (data: MinimumHireCharges) => void;
  readonly?: boolean;
  onSave?: () => void;
  snapshot?: ProposalSnapshot | null;
  calculatorData?: PriceCalculatorResult;
}

export const MinimumHireChargesSection: React.FC<MinimumHireChargesSectionProps> = ({
  data: parentData,
  onChange: parentOnChange,
  readonly = false,
  onSave,
  snapshot,
  calculatorData,
}) => {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('customerId');
  const [hasExistingRecord, setHasExistingRecord] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Default rate values
  const defaultRates = {
    excavatorRatePerHour: 200.00,
    truckRatePerHour: 150.00,
    rockRatePerHour: 250.00,
    cartageRatePerHour: 150.00,
    pipeRatePerHour: 30.00,
    supervisoryRatePerHour: 70.00,
    bobcatRatePerHour: 180.00,
  };

  // Check if snapshot data is available for rate suggestions
  const hasSnapshotRates = snapshot && (snapshot.dig_excavation_rate || snapshot.dig_truck_rate);

  // Manage form state internally
  const [formData, setFormData] = useState<MinimumHireCharges>({
    excavatorRatePerHour: defaultRates.excavatorRatePerHour,
    excavatorMinimumCharge: defaultRates.excavatorRatePerHour * 3,
    truckRatePerHour: defaultRates.truckRatePerHour,
    truckMinimumCharge: defaultRates.truckRatePerHour * 3,
    rockRatePerHour: defaultRates.rockRatePerHour,
    rockMinimumCharge: defaultRates.rockRatePerHour * 3,
    cartageRatePerHour: defaultRates.cartageRatePerHour,
    cartageMinimumCharge: defaultRates.cartageRatePerHour * 3,
    pipeRatePerHour: defaultRates.pipeRatePerHour,
    pipeMinimumCharge: defaultRates.pipeRatePerHour * 4,
    supervisoryRatePerHour: defaultRates.supervisoryRatePerHour,
    supervisoryMinimumCharge: defaultRates.supervisoryRatePerHour * 4,
    bobcatRatePerHour: defaultRates.bobcatRatePerHour,
    bobcatMinimumCharge: defaultRates.bobcatRatePerHour * 3,
  });
  
  const { saveContractSiteDetails, loadContractSiteDetails, isSubmitting } = useContractSiteDetails();

  // Load site details data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading minimum hire charges for customer:', customerId);
        const existingData = await loadContractSiteDetails(customerId);
        
        if (existingData) {
          console.log('✅ Found existing minimum hire charges data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields, using defaults if data doesn't exist
          const mappedData: MinimumHireCharges = {
            excavatorRatePerHour: existingData.afe_i10_exc_rate ?? defaultRates.excavatorRatePerHour,
            excavatorMinimumCharge: existingData.afe_i10_exc_mcharge ?? (defaultRates.excavatorRatePerHour * 3),
            truckRatePerHour: existingData.afe_i10_truck_rate ?? defaultRates.truckRatePerHour,
            truckMinimumCharge: existingData.afe_i10_truck_mcharge ?? (defaultRates.truckRatePerHour * 3),
            rockRatePerHour: existingData.afe_i10_rock_rate ?? defaultRates.rockRatePerHour,
            rockMinimumCharge: existingData.afe_i10_rock_mcharge ?? (defaultRates.rockRatePerHour * 3),
            cartageRatePerHour: existingData.afe_i10_cartage_rate ?? defaultRates.cartageRatePerHour,
            cartageMinimumCharge: existingData.afe_i10_cartage_mcharge ?? (defaultRates.cartageRatePerHour * 3),
            pipeRatePerHour: existingData.afe_i10_pipe_rate ?? defaultRates.pipeRatePerHour,
            pipeMinimumCharge: existingData.afe_i10_pipe_mcharge ?? (defaultRates.pipeRatePerHour * 4),
            supervisoryRatePerHour: existingData.afe_i10_supvis_rate ?? defaultRates.supervisoryRatePerHour,
            supervisoryMinimumCharge: existingData.afe_i10_supvis_mcharge ?? (defaultRates.supervisoryRatePerHour * 4),
            bobcatRatePerHour: existingData.afe_i10_bcat_rate ?? defaultRates.bobcatRatePerHour,
            bobcatMinimumCharge: existingData.afe_i10_bcat_mcharge ?? (defaultRates.bobcatRatePerHour * 3),
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing minimum hire charges data found - component will mount with default values');
          setHasExistingRecord(false);
          // Use default values when no existing data
          // (formData is already initialized with defaults, so no need to set again)
        }
      } catch (error) {
        console.warn('⚠️ Error loading minimum hire charges (component will mount with default values):', error);
        setHasExistingRecord(false);
        // Don't throw error - just continue with default values (already set in initial state)
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

  const handleFieldChange = (field: keyof MinimumHireCharges, value: any) => {
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value,
      };
      
      // Auto-calculate minimum charge when hourly rate changes (3x the hourly rate)
      if (field === "excavatorRatePerHour" && value !== "") {
        const rate = parseFloat(value);
        if (!isNaN(rate)) {
          newData.excavatorMinimumCharge = parseFloat((rate * 3).toFixed(2));
        }
      } else if (field === "truckRatePerHour" && value !== "") {
        const rate = parseFloat(value);
        if (!isNaN(rate)) {
          newData.truckMinimumCharge = parseFloat((rate * 3).toFixed(2));
        }
      } else if (field === "rockRatePerHour" && value !== "") {
        const rate = parseFloat(value);
        if (!isNaN(rate)) {
          newData.rockMinimumCharge = parseFloat((rate * 3).toFixed(2));
        }
      } else if (field === "cartageRatePerHour" && value !== "") {
        const rate = parseFloat(value);
        if (!isNaN(rate)) {
          newData.cartageMinimumCharge = parseFloat((rate * 3).toFixed(2));
        }
      } else if (field === "pipeRatePerHour" && value !== "") {
        const rate = parseFloat(value);
        if (!isNaN(rate)) {
          newData.pipeMinimumCharge = parseFloat((rate * 4).toFixed(2));
        }
      } else if (field === "supervisoryRatePerHour" && value !== "") {
        const rate = parseFloat(value);
        if (!isNaN(rate)) {
          newData.supervisoryMinimumCharge = parseFloat((rate * 4).toFixed(2));
        }
      } else if (field === "bobcatRatePerHour" && value !== "") {
        const rate = parseFloat(value);
        if (!isNaN(rate)) {
          newData.bobcatMinimumCharge = parseFloat((rate * 3).toFixed(2));
        }
      }
      
      return newData;
    });
  };

  // Format currency display
  const formatCurrency = (value: number | string): string => {
    if (value === "" || value === null || value === undefined) return "";
    const numValue = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(numValue) ? "" : numValue.toFixed(2);
  };

  const handleSave = async () => {
    if (!customerId) {
      console.error('No customer ID available');
      return;
    }

    try {
      // Map form fields to database fields using internal formData state
      const siteDetailsData = {
        afe_i10_exc_rate: formData.excavatorRatePerHour === "" ? null : Number(formData.excavatorRatePerHour),
        afe_i10_exc_mcharge: formData.excavatorMinimumCharge === "" ? null : Number(formData.excavatorMinimumCharge),
        afe_i10_truck_rate: formData.truckRatePerHour === "" ? null : Number(formData.truckRatePerHour),
        afe_i10_truck_mcharge: formData.truckMinimumCharge === "" ? null : Number(formData.truckMinimumCharge),
        afe_i10_rock_rate: formData.rockRatePerHour === "" ? null : Number(formData.rockRatePerHour),
        afe_i10_rock_mcharge: formData.rockMinimumCharge === "" ? null : Number(formData.rockMinimumCharge),
        afe_i10_cartage_rate: formData.cartageRatePerHour === "" ? null : Number(formData.cartageRatePerHour),
        afe_i10_cartage_mcharge: formData.cartageMinimumCharge === "" ? null : Number(formData.cartageMinimumCharge),
        afe_i10_pipe_rate: formData.pipeRatePerHour === "" ? null : Number(formData.pipeRatePerHour),
        afe_i10_pipe_mcharge: formData.pipeMinimumCharge === "" ? null : Number(formData.pipeMinimumCharge),
        afe_i10_supvis_rate: formData.supervisoryRatePerHour === "" ? null : Number(formData.supervisoryRatePerHour),
        afe_i10_supvis_mcharge: formData.supervisoryMinimumCharge === "" ? null : Number(formData.supervisoryMinimumCharge),
        afe_i10_bcat_rate: formData.bobcatRatePerHour === "" ? null : Number(formData.bobcatRatePerHour),
        afe_i10_bcat_mcharge: formData.bobcatMinimumCharge === "" ? null : Number(formData.bobcatMinimumCharge),
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
      console.error('Error saving minimum hire charges:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Minimum Hire Charges</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Specify hourly rates and minimum hire charges for equipment. Minimum charges typically default to 3x the hourly rate to cover setup and transportation costs.
        </p>
        
        <div className="grid gap-8">
          {/* Excavator Hire */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Excavator Hire</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label htmlFor="excavatorRatePerHour" className="text-sm font-medium">Rate/Hour (AUD)</Label>
                  {formData.excavatorRatePerHour !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("excavatorRatePerHour", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="excavatorRatePerHour"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.excavatorRatePerHour)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("excavatorRatePerHour", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-transparent">Spacer</p>
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label htmlFor="excavatorMinimumCharge" className="text-sm font-medium">Minimum Charge (AUD)</Label>
                  {formData.excavatorMinimumCharge !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("excavatorMinimumCharge", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="excavatorMinimumCharge"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.excavatorMinimumCharge)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("excavatorMinimumCharge", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Auto: ${formData.excavatorRatePerHour !== "" ? formatCurrency(Number(formData.excavatorRatePerHour) * 3) : "0.00"} (3x rate)
                </p>
              </div>
            </div>
          </div>

          {/* Truck Hire */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Truck Hire</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Rate/Hour (AUD)</Label>
                  {formData.truckRatePerHour !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("truckRatePerHour", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.truckRatePerHour)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("truckRatePerHour", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-transparent">Spacer</p>
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Minimum Charge (AUD)</Label>
                  {formData.truckMinimumCharge !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("truckMinimumCharge", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.truckMinimumCharge)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("truckMinimumCharge", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Auto: ${formData.truckRatePerHour !== "" ? formatCurrency(Number(formData.truckRatePerHour) * 3) : "0.00"} (3x rate)
                </p>
              </div>
            </div>
          </div>

          {/* Rock Excavation */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Rock Excavation</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Rate/Hour (AUD)</Label>
                  {formData.rockRatePerHour !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("rockRatePerHour", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.rockRatePerHour)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("rockRatePerHour", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-transparent">Spacer</p>
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Minimum Charge (AUD)</Label>
                  {formData.rockMinimumCharge !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("rockMinimumCharge", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.rockMinimumCharge)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("rockMinimumCharge", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Auto: ${formData.rockRatePerHour !== "" ? formatCurrency(Number(formData.rockRatePerHour) * 3) : "0.00"} (3x rate)
                </p>
              </div>
            </div>
          </div>

          {/* Cartage */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Cartage (where dumpsite outside a 20km radius of the Site)</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Rate/Hour (AUD)</Label>
                  {formData.cartageRatePerHour !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("cartageRatePerHour", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.cartageRatePerHour)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("cartageRatePerHour", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-transparent">Spacer</p>
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Minimum Charge (AUD)</Label>
                  {formData.cartageMinimumCharge !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("cartageMinimumCharge", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.cartageMinimumCharge)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("cartageMinimumCharge", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Auto: ${formData.cartageRatePerHour !== "" ? formatCurrency(Number(formData.cartageRatePerHour) * 3) : "0.00"} (3x rate)
                </p>
              </div>
            </div>
          </div>

          {/* Pipework */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Pipework</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Rate/Hour (AUD)</Label>
                  {formData.pipeRatePerHour !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("pipeRatePerHour", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.pipeRatePerHour)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("pipeRatePerHour", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-transparent">Spacer</p>
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Minimum Charge (AUD)</Label>
                  {formData.pipeMinimumCharge !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("pipeMinimumCharge", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.pipeMinimumCharge)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("pipeMinimumCharge", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Auto: ${formData.pipeRatePerHour !== "" ? formatCurrency(Number(formData.pipeRatePerHour) * 4) : "0.00"} (4x rate)
                </p>
              </div>
            </div>
          </div>

          {/* Supervisory Labour */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Supervisory Labour</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Rate/Hour (AUD)</Label>
                  {formData.supervisoryRatePerHour !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("supervisoryRatePerHour", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.supervisoryRatePerHour)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("supervisoryRatePerHour", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-transparent">Spacer</p>
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Minimum Charge (AUD)</Label>
                  {formData.supervisoryMinimumCharge !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("supervisoryMinimumCharge", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.supervisoryMinimumCharge)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("supervisoryMinimumCharge", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Auto: ${formData.supervisoryRatePerHour !== "" ? formatCurrency(Number(formData.supervisoryRatePerHour) * 4) : "0.00"} (4x rate)
                </p>
              </div>
            </div>
          </div>

          {/* Bobcat Hire */}
          <div className="space-y-4">
            <h4 className="text-md font-semibold text-gray-900 border-b pb-2">Bobcat Hire</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Rate/Hour (AUD)</Label>
                  {formData.bobcatRatePerHour !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("bobcatRatePerHour", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.bobcatRatePerHour)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("bobcatRatePerHour", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-transparent">Spacer</p>
              </div>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <Label className="text-sm font-medium">Minimum Charge (AUD)</Label>
                  {formData.bobcatMinimumCharge !== "" && !readonly && (
                    <button type="button" onClick={() => handleFieldChange("bobcatMinimumCharge", "")} className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1">
                      <X className="h-3 w-3" />
                      Clear
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formatCurrency(formData.bobcatMinimumCharge)}
                    onChange={readonly ? undefined : (e) => handleFieldChange("bobcatMinimumCharge", e.target.value)}
                    placeholder="0.00"
                    readOnly={readonly}
                    className={`pl-8 ${readonly ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Auto: ${formData.bobcatRatePerHour !== "" ? formatCurrency(Number(formData.bobcatRatePerHour) * 3) : "0.00"} (3x rate)
                </p>
              </div>
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
                (hasExistingRecord ? "Update Minimum Hire Charges" : "Save Minimum Hire Charges")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};