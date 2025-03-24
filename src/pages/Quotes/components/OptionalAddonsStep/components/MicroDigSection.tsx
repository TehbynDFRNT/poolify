
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MicroDigSectionProps {
  required: boolean;
  setRequired: (required: boolean) => void;
  price: number;
  setPrice: (price: number) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

export const MicroDigSection = ({
  required,
  setRequired,
  price,
  setPrice,
  notes,
  setNotes
}: MicroDigSectionProps) => {
  return (
    <Card className={`transition-all ${required ? 'border-primary' : ''}`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start space-x-3">
          <div className="pt-1">
            <Checkbox 
              id="micro-dig-required" 
              checked={required}
              onCheckedChange={() => setRequired(!required)}
            />
          </div>
          <div className="flex-1">
            <Label 
              htmlFor="micro-dig-required" 
              className="font-medium cursor-pointer"
            >
              Micro Dig Required
            </Label>
            <p className="text-sm text-muted-foreground">
              Special excavation requirements using micro equipment
            </p>
          </div>
        </div>
        
        {required && (
          <div className="pl-7 space-y-3">
            <div>
              <Label htmlFor="micro-dig-price" className="mb-1 block">
                Price ($)
              </Label>
              <Input
                id="micro-dig-price"
                type="number"
                value={price || ''}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                placeholder="0.00"
                className="max-w-xs"
              />
            </div>
            
            <div>
              <Label htmlFor="micro-dig-notes" className="mb-1 block">
                Notes and Requirements
              </Label>
              <Textarea
                id="micro-dig-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter detailed requirements for the micro dig..."
                rows={3}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
