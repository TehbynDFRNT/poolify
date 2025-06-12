import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FileText, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ContractBasics, R1_OPTIONS } from "@/types/contract-qa";
import { useContractBasics } from "@/components/contract/hooks/useContractBasics";
import { useSearchParams } from "react-router-dom";

interface ContractBasicsSectionProps {
  data?: ContractBasics; // Make optional since we'll manage state internally
  onChange?: (data: ContractBasics) => void; // Make optional
  readonly?: boolean;
  onSave?: () => void;
}

export const ContractBasicsSection: React.FC<ContractBasicsSectionProps> = ({
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
  const [formData, setFormData] = useState<ContractBasics>({
    isResidentOwner: "",
    contractSubjectToFinance: "",
    lenderName: "",
    workPeriodDays: "",
    anticipatedCommWeek: "",
    inclementWeatherDays: "",
    weekendDays: "",
  });
  
  const { saveContractBasics, loadContractBasics, isSubmitting } = useContractBasics();

  // Load contract basics data on initial mount only
  useEffect(() => {
    if (!customerId || isInitialized) return;

    const loadData = async () => {
      try {
        console.log('🔍 Loading contract basics for customer:', customerId);
        const existingData = await loadContractBasics(customerId);
        
        if (existingData) {
          console.log('✅ Found existing contract basics data:', existingData);
          setHasExistingRecord(true);
          // Map database fields to form fields
          const mappedData: ContractBasics = {
            isResidentOwner: existingData.resident_owner || "",
            contractSubjectToFinance: existingData.finance_needed || "",
            lenderName: existingData.lender_name || "",
            workPeriodDays: existingData.work_period_days || "",
            anticipatedCommWeek: existingData.commencement_week || "",
            inclementWeatherDays: existingData.weather_days || "",
            weekendDays: existingData.weekends_public_holidays || "",
          };
          setFormData(mappedData);
        } else {
          console.log('📝 No existing contract basics data found - component will mount with empty form');
          setHasExistingRecord(false);
        }
      } catch (error) {
        console.warn('⚠️ Error loading contract basics (component will mount with empty form):', error);
        setHasExistingRecord(false);
        // Don't throw error - just continue with empty form
      } finally {
        setIsInitialized(true);
      }
    };

    loadData();
  }, [customerId, isInitialized]); // Include isInitialized to prevent re-runs

  // Reset initialization state on unmount
  useEffect(() => {
    return () => {
      setIsInitialized(false);
    };
  }, []);

  const handleFieldChange = (field: keyof ContractBasics, value: any) => {
    // Update internal state
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      handleFieldChange("anticipatedCommWeek", format(date, "yyyy-MM-dd"));
    }
  };

  const handleSave = async () => {
    if (!customerId) {
      console.error('No customer ID available');
      return;
    }

    try {
      // Map form fields to database fields using internal formData state
      const basicsData = {
        resident_owner: formData.isResidentOwner,
        finance_needed: formData.contractSubjectToFinance,
        lender_name: formData.lenderName || undefined,
        work_period_days: typeof formData.workPeriodDays === 'number' ? formData.workPeriodDays : undefined,
        commencement_week: formData.anticipatedCommWeek || undefined,
        weather_days: typeof formData.inclementWeatherDays === 'number' ? formData.inclementWeatherDays : undefined,
        weekends_public_holidays: typeof formData.weekendDays === 'number' ? formData.weekendDays : undefined,
      };

      const result = await saveContractBasics(customerId, basicsData);
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
      console.error('Error saving contract basics:', error);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Contract Basics</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-6">
          Define fundamental contract terms including financing arrangements, work schedules, and completion timelines. These details form the foundation of the construction agreement.
        </p>
        
        <div className="grid gap-6">
          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="isResidentOwner" className="text-base font-medium">
                Is the Owner the "Resident Owner"? <span className="text-destructive">*</span>
              </Label>
              {formData.isResidentOwner && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("isResidentOwner", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.isResidentOwner}
              onValueChange={(value) => handleFieldChange("isResidentOwner", value)}
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
              <Label htmlFor="contractSubjectToFinance" className="text-base font-medium">
                Is the Contract subject to finance? <span className="text-destructive">*</span>
              </Label>
              {formData.contractSubjectToFinance && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("contractSubjectToFinance", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Select
              value={formData.contractSubjectToFinance}
              onValueChange={(value) => handleFieldChange("contractSubjectToFinance", value)}
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
              <Label htmlFor="lenderName" className="text-base font-medium">Who is the Lender?</Label>
              {formData.lenderName && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("lenderName", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Input
              id="lenderName"
              value={formData.lenderName}
              onChange={readonly ? undefined : (e) => handleFieldChange("lenderName", e.target.value)}
              placeholder="Lender name"
              maxLength={100}
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="workPeriodDays" className="text-base font-medium">
                Work period in days <span className="text-destructive">*</span>
              </Label>
              {formData.workPeriodDays !== "" && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("workPeriodDays", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Input
              id="workPeriodDays"
              type="number"
              value={formData.workPeriodDays}
              onChange={readonly ? undefined : (e) => handleFieldChange("workPeriodDays", parseInt(e.target.value) || "")}
              placeholder="Number of days"
              min="1"
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label className="text-base font-medium">Anticipated commencement week</Label>
              {formData.anticipatedCommWeek && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("anticipatedCommWeek", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.anticipatedCommWeek && "text-muted-foreground",
                    readonly && "bg-gray-50 cursor-not-allowed"
                  )}
                  disabled={readonly}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.anticipatedCommWeek ? (
                    format(new Date(formData.anticipatedCommWeek), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar
                  mode="single"
                  selected={formData.anticipatedCommWeek ? new Date(formData.anticipatedCommWeek) : undefined}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="inclementWeatherDays" className="text-base font-medium">Inclement weather allowance</Label>
              {formData.inclementWeatherDays !== "" && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("inclementWeatherDays", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Input
              id="inclementWeatherDays"
              type="number"
              value={formData.inclementWeatherDays}
              onChange={readonly ? undefined : (e) => handleFieldChange("inclementWeatherDays", parseInt(e.target.value) || "")}
              placeholder="Number of days"
              min="0"
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <div className="flex justify-between items-start">
              <Label htmlFor="weekendDays" className="text-base font-medium">Weekend allowance</Label>
              {formData.weekendDays !== "" && !readonly && (
                <button
                  type="button"
                  onClick={() => handleFieldChange("weekendDays", "")}
                  className="text-xs text-destructive hover:text-destructive/80 underline inline-flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove Value
                </button>
              )}
            </div>
            <Input
              id="weekendDays"
              type="number"
              value={formData.weekendDays}
              onChange={readonly ? undefined : (e) => handleFieldChange("weekendDays", parseInt(e.target.value) || "")}
              placeholder="Number of days"
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
                (hasExistingRecord ? "Update Contract Basics" : "Save Contract Basics")
              }
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};