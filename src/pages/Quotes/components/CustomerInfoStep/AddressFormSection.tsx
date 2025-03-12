
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

interface AddressFormSectionProps {
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddressFormSection = ({ errors, onChange }: AddressFormSectionProps) => {
  const { quoteData } = useQuoteContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="home_address">Home Address</Label>
        <Input
          id="home_address"
          name="home_address"
          value={quoteData.home_address || ''}
          onChange={onChange}
          className={errors.home_address ? 'border-red-500' : ''}
          required
        />
        {errors.home_address && (
          <p className="text-sm text-red-500">{errors.home_address}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="site_address">Site Address</Label>
        <Input
          id="site_address"
          name="site_address"
          value={quoteData.site_address || ''}
          onChange={onChange}
          className={errors.site_address ? 'border-red-500' : ''}
          required
        />
        {errors.site_address && (
          <p className="text-sm text-red-500">{errors.site_address}</p>
        )}
      </div>
    </div>
  );
};
