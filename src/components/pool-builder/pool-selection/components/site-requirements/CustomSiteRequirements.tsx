
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface CustomRequirement {
  id: string;
  description: string;
  price: number;
}

interface CustomSiteRequirementsProps {
  requirements: CustomRequirement[];
  addRequirement: () => void;
  removeRequirement: (id: string) => void;
  updateRequirement: (id: string, field: 'description' | 'price', value: string) => void;
}

export const CustomSiteRequirements: React.FC<CustomSiteRequirementsProps> = ({
  requirements,
  addRequirement,
  removeRequirement,
  updateRequirement
}) => {
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
      
      {requirements.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-muted-foreground text-sm">
            No custom requirements added. Click "Add Requirement" to add specific site needs.
          </CardContent>
        </Card>
      ) : (
        requirements.map((req) => (
          <Card key={req.id}>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-3">
                  <Label htmlFor={`req-desc-${req.id}`} className="mb-1 block">Description</Label>
                  <Input
                    id={`req-desc-${req.id}`}
                    value={req.description}
                    onChange={(e) => updateRequirement(req.id, 'description', e.target.value)}
                    placeholder="Enter requirement description"
                  />
                </div>
                <div>
                  <Label htmlFor={`req-price-${req.id}`} className="mb-1 block">Price ($)</Label>
                  <div className="flex">
                    <Input
                      id={`req-price-${req.id}`}
                      type="number"
                      value={req.price || ''}
                      onChange={(e) => updateRequirement(req.id, 'price', e.target.value)}
                      placeholder="0.00"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-1"
                      onClick={() => removeRequirement(req.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
