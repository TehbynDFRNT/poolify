
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

interface ResidentHomeownerCheckboxProps {
  onCheckedChange: (checked: boolean) => void;
}

export const ResidentHomeownerCheckbox = ({ onCheckedChange }: ResidentHomeownerCheckboxProps) => {
  const { quoteData } = useQuoteContext();

  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="resident_homeowner"
        checked={quoteData.resident_homeowner || false}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor="resident_homeowner" className="text-sm font-normal">
        Resident Homeowner
      </Label>
    </div>
  );
};
