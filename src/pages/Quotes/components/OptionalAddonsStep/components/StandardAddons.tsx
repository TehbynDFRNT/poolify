
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Addon } from "../types";

interface StandardAddonsProps {
  addons: Addon[];
  toggleAddon: (id: string) => void;
  updateQuantity: (id: string, increment: boolean) => void;
}

export const StandardAddons = ({ addons, toggleAddon, updateQuantity }: StandardAddonsProps) => {
  return (
    <div className="space-y-4">
      {addons.map((addon) => (
        <Card key={addon.id} className={`transition-all ${addon.selected ? 'border-primary' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="pt-1">
                <Checkbox 
                  id={`addon-${addon.id}`} 
                  checked={addon.selected}
                  onCheckedChange={() => toggleAddon(addon.id)}
                />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between">
                  <Label 
                    htmlFor={`addon-${addon.id}`} 
                    className="font-medium cursor-pointer"
                  >
                    {addon.name}
                  </Label>
                  <span className="font-medium">${addon.price.toFixed(2)}</span>
                </div>
                <p className="text-sm text-muted-foreground">{addon.description}</p>
                
                {addon.selected && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(addon.id, false)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input 
                      type="number" 
                      value={addon.quantity} 
                      className="w-20 h-8 text-center" 
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          updateQuantity(
                            addon.id, 
                            value > addon.quantity // simulate increment or decrement
                          );
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(addon.id, true)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="ml-2 text-muted-foreground">
                      ${(addon.price * addon.quantity).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
