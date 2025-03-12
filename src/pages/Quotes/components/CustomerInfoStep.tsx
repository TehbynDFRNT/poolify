
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";

const customerInfoSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  customer_email: z.string().email("Invalid email address"),
  customer_phone: z.string().min(1, "Phone number is required"),
  owner2_name: z.string().optional(),
  owner2_email: z.string().email("Invalid email address").optional(),
  owner2_phone: z.string().optional(),
  home_address: z.string().min(1, "Home address is required"),
  site_address: z.string().min(1, "Site address is required"),
  installation_area: z.string().min(1, "Installation area is required"),
  proposal_name: z.string().optional(),
  resident_homeowner: z.boolean().optional(),
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

  const handleCheckboxChange = (checked: boolean) => {
    updateQuoteData({ resident_homeowner: checked });
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
      <div className="space-y-6">
        {/* Owner 1 Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Owner 1</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Full Name</Label>
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
        </div>

        {/* Owner 2 Section */}
        <div>
          <h3 className="text-lg font-medium mb-4">Owner 2 (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner2_name">Full Name</Label>
              <Input
                id="owner2_name"
                name="owner2_name"
                value={quoteData.owner2_name || ''}
                onChange={handleChange}
                className={errors.owner2_name ? 'border-red-500' : ''}
              />
              {errors.owner2_name && (
                <p className="text-sm text-red-500">{errors.owner2_name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="owner2_phone">Phone Number</Label>
              <Input
                id="owner2_phone"
                name="owner2_phone"
                value={quoteData.owner2_phone || ''}
                onChange={handleChange}
                className={errors.owner2_phone ? 'border-red-500' : ''}
              />
              {errors.owner2_phone && (
                <p className="text-sm text-red-500">{errors.owner2_phone}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="owner2_email">Email Address</Label>
              <Input
                id="owner2_email"
                name="owner2_email"
                type="email"
                value={quoteData.owner2_email || ''}
                onChange={handleChange}
                className={errors.owner2_email ? 'border-red-500' : ''}
              />
              {errors.owner2_email && (
                <p className="text-sm text-red-500">{errors.owner2_email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="home_address">Home Address</Label>
            <Input
              id="home_address"
              name="home_address"
              value={quoteData.home_address || ''}
              onChange={handleChange}
              className={errors.home_address ? 'border-red-500' : ''}
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
              onChange={handleChange}
              className={errors.site_address ? 'border-red-500' : ''}
            />
            {errors.site_address && (
              <p className="text-sm text-red-500">{errors.site_address}</p>
            )}
          </div>
        </div>

        {/* Project Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="proposal_name">Proposal Name</Label>
            <Input
              id="proposal_name"
              name="proposal_name"
              value={quoteData.proposal_name || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="installation_area">Installation Area</Label>
            <Input
              id="installation_area"
              name="installation_area"
              value={quoteData.installation_area || ''}
              onChange={handleChange}
              className={errors.installation_area ? 'border-red-500' : ''}
            />
            {errors.installation_area && (
              <p className="text-sm text-red-500">{errors.installation_area}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {/* Checkbox for Resident Homeowner */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="resident_homeowner"
            checked={quoteData.resident_homeowner || false}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="resident_homeowner" className="text-sm font-normal">
            Resident Homeowner
          </Label>
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
