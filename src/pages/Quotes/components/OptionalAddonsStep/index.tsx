
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Save, Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface OptionalAddonsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

// Define addon types
interface Addon {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
  quantity: number;
}

export const OptionalAddonsStep = ({ onNext, onPrevious }: OptionalAddonsStepProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addons, setAddons] = useState<Addon[]>([
    {
      id: "pool-cleaner",
      name: "Automatic Pool Cleaner",
      description: "Keeps your pool clean with minimal effort",
      price: 699,
      selected: false,
      quantity: 1
    },
    {
      id: "led-lighting",
      name: "LED Pool Lighting",
      description: "Illuminates your pool with energy-efficient LED lights",
      price: 499,
      selected: false,
      quantity: 1
    },
    {
      id: "heating-system",
      name: "Pool Heating System",
      description: "Extends your swimming season with temperature control",
      price: 1299,
      selected: false,
      quantity: 1
    },
    {
      id: "salt-system",
      name: "Salt Chlorination System",
      description: "Natural water treatment without harsh chemicals",
      price: 899,
      selected: false,
      quantity: 1
    },
    {
      id: "pool-cover",
      name: "Automatic Pool Cover",
      description: "Safety and heat retention with automated opening/closing",
      price: 1599,
      selected: false,
      quantity: 1
    }
  ]);

  // Calculate total addons cost
  const calculateAddonsCost = () => {
    return addons.reduce((total, addon) => {
      if (addon.selected) {
        return total + (addon.price * addon.quantity);
      }
      return total;
    }, 0);
  };

  // Update total when addons change
  useEffect(() => {
    const totalCost = calculateAddonsCost();
    updateQuoteData({ optional_addons_cost: totalCost });
  }, [addons]);

  useEffect(() => {
    // Show warning but don't block progress if no pool is selected
    if (!quoteData.pool_id) {
      toast.warning("No pool selected. You can continue, but the quote will be incomplete.");
    }
  }, [quoteData.pool_id]);

  const toggleAddon = (id: string) => {
    setAddons(addons.map(addon => {
      if (addon.id === id) {
        return { ...addon, selected: !addon.selected };
      }
      return addon;
    }));
  };

  const updateQuantity = (id: string, increment: boolean) => {
    setAddons(addons.map(addon => {
      if (addon.id === id) {
        const newQuantity = increment 
          ? addon.quantity + 1 
          : Math.max(1, addon.quantity - 1);
        return { ...addon, quantity: newQuantity };
      }
      return addon;
    }));
  };

  const saveAddons = async (continueToNext: boolean) => {
    if (!quoteData.id) {
      toast.error("No quote ID found. Please complete the previous steps first.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // These fields now exist in the database, so we can use type-safe updates
      const dataToSave = {
        optional_addons_cost: calculateAddonsCost()
      };
      
      // Update the record in Supabase
      const { error } = await supabase
        .from('quotes')
        .update(dataToSave)
        .eq('id', quoteData.id);
      
      if (error) {
        console.error("Error updating optional addons:", error);
        throw error;
      }
      
      toast.success("Optional addons saved");
      setIsSubmitting(false);
      if (continueToNext) onNext();
    } catch (error) {
      console.error("Error saving optional addons:", error);
      toast.error("Failed to save optional addons");
      setIsSubmitting(false);
    }
  };

  const handleSaveOnly = async () => {
    await saveAddons(false);
  };

  const handleSaveAndContinue = async () => {
    await saveAddons(true);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enhance the pool installation with optional add-ons and upgrades.
      </p>
      
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
                            setAddons(addons.map(a => 
                              a.id === addon.id ? {...a, quantity: value} : a
                            ));
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

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Add-ons Cost:</span>
            <span className="text-lg font-bold">${calculateAddonsCost().toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
        >
          Back
        </Button>
        
        <div className="space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSaveOnly}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button 
            type="button"
            onClick={handleSaveAndContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};
