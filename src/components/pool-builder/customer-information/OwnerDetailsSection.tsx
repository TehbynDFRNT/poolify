
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface OwnerDetailsSectionProps {
  owner1: string;
  setOwner1: (value: string) => void;
  owner2: string;
  setOwner2: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  readonly?: boolean;
}

const OwnerDetailsSection: React.FC<OwnerDetailsSectionProps> = ({
  owner1,
  setOwner1,
  owner2,
  setOwner2,
  phone,
  setPhone,
  email,
  setEmail,
  readonly = false,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Owner Details</h3>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="owner1">Owner 1 <span className="text-destructive">*</span></Label>
            <Input
              id="owner1"
              value={owner1}
              onChange={readonly ? undefined : (e) => setOwner1(e.target.value)}
              placeholder="Primary Owner's Full Name"
              required
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="owner2">Owner 2 <span className="text-muted-foreground text-sm">(optional)</span></Label>
            <Input
              id="owner2"
              value={owner2}
              onChange={readonly ? undefined : (e) => setOwner2(e.target.value)}
              placeholder="Secondary Owner's Full Name"
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={readonly ? undefined : (e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              required
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={readonly ? undefined : (e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              readOnly={readonly}
              className={readonly ? "bg-gray-50 cursor-not-allowed" : ""}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OwnerDetailsSection;
