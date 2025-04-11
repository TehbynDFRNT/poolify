
import React, { useState, useEffect } from "react";
import { Pool } from "@/types/pool";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Droplet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SpaJet {
  id: string;
  model_number: string;
  cost_price: number;
  margin: number;
  total: number;
  description: string;
}

interface SpaJetsSelection {
  standardJetsQuantity: string;
  includeJetPump: boolean;
  includeRoundPoolUpgrade: boolean;
  includePepperPots: boolean;
}

interface SpaJetsSectionProps {
  pool: Pool;
  customerId: string | null;
  onSelectionChange?: (totals: {
    totalPrice: number;
    totalCost: number;
    totalMargin: number;
  }) => void;
}

export const SpaJetsSection: React.FC<SpaJetsSectionProps> = ({ 
  pool, 
  customerId,
  onSelectionChange 
}) => {
  const [spaJets, setSpaJets] = useState<SpaJet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selection, setSelection] = useState<SpaJetsSelection>({
    standardJetsQuantity: "0",
    includeJetPump: false,
    includeRoundPoolUpgrade: false,
    includePepperPots: false
  });
  const { toast } = useToast();

  // Pre-defined quantities based on the requirements
  const allowedQuantities = ["0", "4", "6"];

  useEffect(() => {
    fetchSpaJets();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [selection, spaJets]);

  const fetchSpaJets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('spa_jets')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      setSpaJets(data || []);
    } catch (error: any) {
      console.error("Error fetching spa jets:", error);
      toast({
        title: "Error loading spa jets",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const findSpaJet = (modelNumber: string) => {
    return spaJets.find(jet => jet.model_number === modelNumber);
  };

  const calculateTotals = () => {
    if (spaJets.length === 0) return;

    const standardJet = findSpaJet("ASF440");
    const jetPump = findSpaJet("Spa Jet Pump");
    const roundPoolUpgrade = findSpaJet("Round Pool 23 Spa Jet Upgrade");
    const pepperPots = findSpaJet("Pepper Pots");

    const quantity = parseInt(selection.standardJetsQuantity) || 0;

    let totalPrice = 0;
    let totalCost = 0;
    let totalMargin = 0;

    // Add standard jets based on quantity
    if (standardJet) {
      totalPrice += standardJet.total * quantity;
      totalCost += standardJet.cost_price * quantity;
      totalMargin += standardJet.margin * quantity;
    }

    // Add jet pump if selected
    if (selection.includeJetPump && jetPump) {
      totalPrice += jetPump.total;
      totalCost += jetPump.cost_price;
      totalMargin += jetPump.margin;
    }

    // Add round pool upgrade if selected
    if (selection.includeRoundPoolUpgrade && roundPoolUpgrade) {
      totalPrice += roundPoolUpgrade.total;
      totalCost += roundPoolUpgrade.cost_price;
      totalMargin += roundPoolUpgrade.margin;
    }

    // Add pepper pots if selected
    if (selection.includePepperPots && pepperPots) {
      totalPrice += pepperPots.total;
      totalCost += pepperPots.cost_price;
      totalMargin += pepperPots.margin;
    }

    if (onSelectionChange) {
      onSelectionChange({
        totalPrice,
        totalCost,
        totalMargin
      });
    }
  };

  const handleQuantityChange = (value: string) => {
    setSelection(prev => ({
      ...prev,
      standardJetsQuantity: value
    }));
  };

  const handleToggleChange = (key: keyof SpaJetsSelection, value: boolean) => {
    setSelection(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading spa jet options...</p>
        </CardContent>
      </Card>
    );
  }

  // Find specific spa jet products
  const standardJet = findSpaJet("ASF440");
  const jetPump = findSpaJet("Spa Jet Pump");
  const roundPoolUpgrade = findSpaJet("Round Pool 23 Spa Jet Upgrade");
  const pepperPots = findSpaJet("Pepper Pots");

  // Calculate totals for the standard jets based on quantity
  const quantity = parseInt(selection.standardJetsQuantity) || 0;
  const standardJetTotalPrice = standardJet ? standardJet.total * quantity : 0;

  return (
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          <CardTitle>Spa Jets</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Standard Spa Jets (ASF440) */}
        <div className="space-y-3">
          <Label htmlFor="standard-spa-jets">Select number of spa jets (ASF440)</Label>
          <ToggleGroup 
            type="single" 
            variant="outline" 
            value={selection.standardJetsQuantity}
            onValueChange={handleQuantityChange}
            className="justify-start"
          >
            {allowedQuantities.map((qty) => (
              <ToggleGroupItem 
                key={qty} 
                value={qty}
                className="px-4"
              >
                {qty}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          
          {standardJet && quantity > 0 && (
            <div className="pt-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit Price:</span>
                <span>{formatPrice(standardJet.total)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total for {quantity} jets:</span>
                <span>{formatPrice(standardJetTotalPrice)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Spa Jet Pump */}
        {jetPump && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Include Spa Jet Pump?</Label>
              <p className="text-sm text-muted-foreground">{formatPrice(jetPump.total)}</p>
            </div>
            <Switch 
              checked={selection.includeJetPump}
              onCheckedChange={(checked) => handleToggleChange('includeJetPump', checked)}
            />
          </div>
        )}

        {/* Round Pool 23 Spa Jet Upgrade */}
        {roundPoolUpgrade && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Apply Round Pool 23 Spa Jet Upgrade?</Label>
              <p className="text-sm text-muted-foreground">{formatPrice(roundPoolUpgrade.total)}</p>
            </div>
            <Switch 
              checked={selection.includeRoundPoolUpgrade}
              onCheckedChange={(checked) => handleToggleChange('includeRoundPoolUpgrade', checked)}
            />
          </div>
        )}

        {/* Pepper Pots */}
        {pepperPots && (
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Include Pepper Pot Air System?</Label>
              <p className="text-sm text-muted-foreground">{formatPrice(pepperPots.total)}</p>
            </div>
            <Switch 
              checked={selection.includePepperPots}
              onCheckedChange={(checked) => handleToggleChange('includePepperPots', checked)}
            />
          </div>
        )}

        {/* Total Summary */}
        <div className="mt-6 p-4 border rounded-lg bg-slate-50">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Standard Jets ({quantity}x):</span>
              <span>{formatPrice(standardJetTotalPrice)}</span>
            </div>
            
            {selection.includeJetPump && jetPump && (
              <div className="flex justify-between">
                <span className="font-medium">Spa Jet Pump:</span>
                <span>{formatPrice(jetPump.total)}</span>
              </div>
            )}
            
            {selection.includeRoundPoolUpgrade && roundPoolUpgrade && (
              <div className="flex justify-between">
                <span className="font-medium">Round Pool 23 Upgrade:</span>
                <span>{formatPrice(roundPoolUpgrade.total)}</span>
              </div>
            )}
            
            {selection.includePepperPots && pepperPots && (
              <div className="flex justify-between">
                <span className="font-medium">Pepper Pot Air System:</span>
                <span>{formatPrice(pepperPots.total)}</span>
              </div>
            )}
            
            <div className="pt-2 border-t mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>{formatPrice(
                  standardJetTotalPrice +
                  (selection.includeJetPump && jetPump ? jetPump.total : 0) +
                  (selection.includeRoundPoolUpgrade && roundPoolUpgrade ? roundPoolUpgrade.total : 0) +
                  (selection.includePepperPots && pepperPots ? pepperPots.total : 0)
                )}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
