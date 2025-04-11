
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { CustomSiteRequirement } from "../types";

interface CustomSiteRequirementsProps {
  requirements: CustomSiteRequirement[];
  addRequirement: () => void;
  removeRequirement: (id: string) => void;
  updateRequirement: (id: string, field: 'description' | 'price' | 'margin', value: string) => void;
}

export const CustomSiteRequirements = ({
  requirements,
  addRequirement,
  removeRequirement,
  updateRequirement
}: CustomSiteRequirementsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Custom Site Requirements</h3>
        <Button 
          type="button" 
          size="sm" 
          onClick={addRequirement}
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Requirement
        </Button>
      </div>
      
      {requirements.map((req) => (
        <Card key={req.id}>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-6">
                <Label htmlFor={`req-desc-${req.id}`} className="mb-1 block">Description</Label>
                <Input
                  id={`req-desc-${req.id}`}
                  value={req.description}
                  onChange={(e) => updateRequirement(req.id, 'description', e.target.value)}
                  placeholder="Enter requirement description"
                />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor={`req-price-${req.id}`} className="mb-1 block">Price ($)</Label>
                <Input
                  id={`req-price-${req.id}`}
                  type="number"
                  value={req.price || ''}
                  onChange={(e) => updateRequirement(req.id, 'price', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor={`req-margin-${req.id}`} className="mb-1 block">Margin (%)</Label>
                <Input
                  id={`req-margin-${req.id}`}
                  type="number"
                  value={req.margin || ''}
                  onChange={(e) => updateRequirement(req.id, 'margin', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-auto"
                  onClick={() => removeRequirement(req.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
