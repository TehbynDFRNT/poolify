import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ContractBasics, R1_OPTIONS } from "@/types/contract-qa";

interface ContractBasicsSectionProps {
  data: ContractBasics;
  onChange: (data: ContractBasics) => void;
  readonly?: boolean;
  onSave?: () => void;
}

export const ContractBasicsSection: React.FC<ContractBasicsSectionProps> = ({
  data,
  onChange,
  readonly = false,
  onSave,
}) => {
  const handleFieldChange = (field: keyof ContractBasics, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      handleFieldChange("anticipatedCommWeek", format(date, "yyyy-MM-dd"));
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
            <Label htmlFor="isResidentOwner" className="text-base font-medium">
              Is the Owner the "Resident Owner"? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.isResidentOwner}
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
            <Label htmlFor="contractSubjectToFinance" className="text-base font-medium">
              Is the Contract subject to finance? <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.contractSubjectToFinance}
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
            <Label htmlFor="lenderName" className="text-base font-medium">Who is the Lender?</Label>
            <Input
              id="lenderName"
              value={data.lenderName}
              onChange={readonly ? undefined : (e) => handleFieldChange("lenderName", e.target.value)}
              placeholder="Lender name"
              maxLength={100}
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="workPeriodDays" className="text-base font-medium">
              Work period in days <span className="text-destructive">*</span>
            </Label>
            <Input
              id="workPeriodDays"
              type="number"
              value={data.workPeriodDays}
              onChange={readonly ? undefined : (e) => handleFieldChange("workPeriodDays", parseInt(e.target.value) || "")}
              placeholder="Number of days"
              min="1"
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <Label className="text-base font-medium">Anticipated commencement week</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !data.anticipatedCommWeek && "text-muted-foreground",
                    readonly && "bg-gray-50 cursor-not-allowed"
                  )}
                  disabled={readonly}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.anticipatedCommWeek ? (
                    format(new Date(data.anticipatedCommWeek), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data.anticipatedCommWeek ? new Date(data.anticipatedCommWeek) : undefined}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="inclementWeatherDays" className="text-base font-medium">Inclement weather allowance</Label>
            <Input
              id="inclementWeatherDays"
              type="number"
              value={data.inclementWeatherDays}
              onChange={readonly ? undefined : (e) => handleFieldChange("inclementWeatherDays", parseInt(e.target.value) || "")}
              placeholder="Number of days"
              min="0"
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="weekendDays" className="text-base font-medium">Weekend allowance</Label>
            <Input
              id="weekendDays"
              type="number"
              value={data.weekendDays}
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
              onClick={onSave}
              className="min-w-[140px]"
            >
              Save Contract Basics
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};