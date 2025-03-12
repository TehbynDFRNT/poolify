
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { z } from "zod";

const customerInfoSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  desired_timeline: z.string().min(1, "Timeline is required"),
});

type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;

interface CustomerInfoStepProps {
  onNext: () => void;
}

export const CustomerInfoStep = ({ onNext }: CustomerInfoStepProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfoFormData, string>>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateQuoteData({ [name]: value });
    
    // Clear error when field is edited
    if (errors[name as keyof CustomerInfoFormData]) {
      setErrors(prev => {
        const updated = { ...prev };
        delete updated[name as keyof CustomerInfoFormData];
        return updated;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      customerInfoSchema.parse(quoteData);
      onNext();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof CustomerInfoFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof CustomerInfoFormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer_name">Customer Name</Label>
            <Input
              id="customer_name"
              name="customer_name"
              value={quoteData.customer_name || ''}
              onChange={handleChange}
              className={errors.customer_name ? 'border-red-500' : ''}
            />
            {errors.customer_name && (
              <p className="text-sm text-red-500">{errors.customer_name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customer_email">Email Address</Label>
            <Input
              id="customer_email"
              name="customer_email"
              type="email"
              value={quoteData.customer_email || ''}
              onChange={handleChange}
              className={errors.customer_email ? 'border-red-500' : ''}
            />
            {errors.customer_email && (
              <p className="text-sm text-red-500">{errors.customer_email}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customer_phone">Phone Number</Label>
            <Input
              id="customer_phone"
              name="customer_phone"
              value={quoteData.customer_phone || ''}
              onChange={handleChange}
              className={errors.customer_phone ? 'border-red-500' : ''}
            />
            {errors.customer_phone && (
              <p className="text-sm text-red-500">{errors.customer_phone}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Project Location</Label>
            <Input
              id="location"
              name="location"
              value={quoteData.location || ''}
              onChange={handleChange}
              className={errors.location ? 'border-red-500' : ''}
            />
            {errors.location && (
              <p className="text-sm text-red-500">{errors.location}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="desired_timeline">Desired Timeline</Label>
          <Input
            id="desired_timeline"
            name="desired_timeline"
            placeholder="e.g., Summer 2023, ASAP, 3 months"
            value={quoteData.desired_timeline || ''}
            onChange={handleChange}
            className={errors.desired_timeline ? 'border-red-500' : ''}
          />
          {errors.desired_timeline && (
            <p className="text-sm text-red-500">{errors.desired_timeline}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Continue
        </Button>
      </div>
    </form>
  );
};
