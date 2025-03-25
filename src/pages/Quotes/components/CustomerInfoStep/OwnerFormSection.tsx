
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { CustomerInfoFormErrors } from "./customerInfoSchema";

interface OwnerFormSectionProps {
  ownerNumber: 1 | 2;
  errors: CustomerInfoFormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const OwnerFormSection = ({ 
  ownerNumber, 
  errors, 
  onChange 
}: OwnerFormSectionProps) => {
  const { quoteData } = useQuoteContext();
  
  // Make sure quoteData exists before accessing properties
  if (!quoteData) {
    return <div>Loading owner information...</div>;
  }
  
  const prefix = ownerNumber === 1 ? 'customer' : 'owner2';
  const required = ownerNumber === 1;
  const title = `Owner ${ownerNumber}${ownerNumber === 2 ? ' (Optional)' : ''}`;

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}_name`}>Full Name</Label>
          <Input
            id={`${prefix}_name`}
            name={`${prefix}_name`}
            value={quoteData[`${prefix}_name` as keyof typeof quoteData] as string || ''}
            onChange={onChange}
            className={errors[`${prefix}_name`] ? 'border-red-500' : ''}
            required={required}
          />
          {errors[`${prefix}_name`] && (
            <p className="text-sm text-red-500">{errors[`${prefix}_name`]}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${prefix}_phone`}>Phone Number</Label>
          <Input
            id={`${prefix}_phone`}
            name={`${prefix}_phone`}
            value={quoteData[`${prefix}_phone` as keyof typeof quoteData] as string || ''}
            onChange={onChange}
            className={errors[`${prefix}_phone`] ? 'border-red-500' : ''}
            required={required}
          />
          {errors[`${prefix}_phone`] && (
            <p className="text-sm text-red-500">{errors[`${prefix}_phone`]}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`${prefix}_email`}>Email Address</Label>
          <Input
            id={`${prefix}_email`}
            name={`${prefix}_email`}
            type="email"
            value={quoteData[`${prefix}_email` as keyof typeof quoteData] as string || ''}
            onChange={onChange}
            className={errors[`${prefix}_email`] ? 'border-red-500' : ''}
            required={required}
          />
          {errors[`${prefix}_email`] && (
            <p className="text-sm text-red-500">{errors[`${prefix}_email`]}</p>
          )}
        </div>
      </div>
    </div>
  );
};
