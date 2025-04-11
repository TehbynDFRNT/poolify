
import React, { useState, useEffect } from "react";
import { Pool } from "@/types/pool";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Droplet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

// Fixed values based on requirements
const SPA_JET_PRICE = 220;
const SPA_JET_COST = 145;
const SPA_JET_MARGIN = 75;

const JET_PUMP_PRICE = 1000;
const JET_PUMP_COST = 800;
const JET_PUMP_MARGIN = 200;

const ROUND_POOL_UPGRADE_PRICE = 4500;
const ROUND_POOL_UPGRADE_COST = 3500;
const ROUND_POOL_UPGRADE_MARGIN = 1000;

const PEPPER_POTS_PRICE = 1850;
const PEPPER_POTS_COST = 1200;
const PEPPER_POTS_MARGIN = 600;

export const SpaJetsSection: React.FC<SpaJetsSectionProps> = ({ 
  pool, 
  customerId,
  onSelectionChange 
}) => {
  const [isLoading, setIsLoading] = useState(false);
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
    calculateTotals();
  }, [selection]);

  const calculateTotals = () => {
    const quantity = parseInt(selection.standardJetsQuantity) || 0;

    let totalPrice = 0;
    let totalCost = 0;
    let totalMargin = 0;

    // Add standard jets based on quantity
    totalPrice += SPA_JET_PRICE * quantity;
    totalCost += SPA_JET_COST * quantity;
    totalMargin += SPA_JET_MARGIN * quantity;

    // Add jet pump if selected
    if (selection.includeJetPump) {
      totalPrice += JET_PUMP_PRICE;
      totalCost += JET_PUMP_COST;
      totalMargin += JET_PUMP_MARGIN;
    }

    // Add round pool upgrade if selected
    if (selection.includeRoundPoolUpgrade) {
      totalPrice += ROUND_POOL_UPGRADE_PRICE;
      totalCost += ROUND_POOL_UPGRADE_COST;
      totalMargin += ROUND_POOL_UPGRADE_MARGIN;
    }

    // Add pepper pots if selected
    if (selection.includePepperPots) {
      totalPrice += PEPPER_POTS_PRICE;
      totalCost += PEPPER_POTS_COST;
      totalMargin += PEPPER_POTS_MARGIN;
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

  // Calculate totals for the standard jets based on quantity
  const quantity = parseInt(selection.standardJetsQuantity) || 0;
  const standardJetTotalPrice = SPA_JET_PRICE * quantity;
  const standardJetTotalCost = SPA_JET_COST * quantity;
  const standardJetTotalMargin = SPA_JET_MARGIN * quantity;

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
          
          {quantity > 0 && (
            <div className="pt-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit Price:</span>
                <span>{formatPrice(SPA_JET_PRICE)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit Cost:</span>
                <span>{formatPrice(SPA_JET_COST)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit Margin:</span>
                <span>{formatPrice(SPA_JET_MARGIN)}</span>
              </div>
              <div className="flex justify-between font-medium mt-1">
                <span>Total for {quantity} jets:</span>
                <span>{formatPrice(standardJetTotalPrice)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4"></div>

        {/* Spa Jet Pump */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Include Spa Jet Pump?</Label>
            <p className="text-sm text-muted-foreground">
              Price: {formatPrice(JET_PUMP_PRICE)} (Cost: {formatPrice(JET_PUMP_COST)}, Margin: {formatPrice(JET_PUMP_MARGIN)})
            </p>
          </div>
          <Switch 
            checked={selection.includeJetPump}
            onCheckedChange={(checked) => handleToggleChange('includeJetPump', checked)}
          />
        </div>

        {/* Round Pool 23 Spa Jet Upgrade */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Apply Round Pool 23 Spa Jet Upgrade?</Label>
            <p className="text-sm text-muted-foreground">
              Price: {formatPrice(ROUND_POOL_UPGRADE_PRICE)} (Cost: {formatPrice(ROUND_POOL_UPGRADE_COST)}, Margin: {formatPrice(ROUND_POOL_UPGRADE_MARGIN)})
            </p>
          </div>
          <Switch 
            checked={selection.includeRoundPoolUpgrade}
            onCheckedChange={(checked) => handleToggleChange('includeRoundPoolUpgrade', checked)}
          />
        </div>

        {/* Pepper Pots */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Include Pepper Pot Air System?</Label>
            <p className="text-sm text-muted-foreground">
              Price: {formatPrice(PEPPER_POTS_PRICE)} (Cost: {formatPrice(PEPPER_POTS_COST)}, Margin: {formatPrice(PEPPER_POTS_MARGIN)})
            </p>
          </div>
          <Switch 
            checked={selection.includePepperPots}
            onCheckedChange={(checked) => handleToggleChange('includePepperPots', checked)}
          />
        </div>

        {/* Total Summary */}
        <div className="mt-6 p-4 border rounded-lg bg-slate-50">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Standard Jets ({quantity}x):</span>
              <span>{formatPrice(standardJetTotalPrice)}</span>
            </div>
            
            {selection.includeJetPump && (
              <div className="flex justify-between">
                <span className="font-medium">Spa Jet Pump:</span>
                <span>{formatPrice(JET_PUMP_PRICE)}</span>
              </div>
            )}
            
            {selection.includeRoundPoolUpgrade && (
              <div className="flex justify-between">
                <span className="font-medium">Round Pool 23 Upgrade:</span>
                <span>{formatPrice(ROUND_POOL_UPGRADE_PRICE)}</span>
              </div>
            )}
            
            {selection.includePepperPots && (
              <div className="flex justify-between">
                <span className="font-medium">Pepper Pot Air System:</span>
                <span>{formatPrice(PEPPER_POTS_PRICE)}</span>
              </div>
            )}
            
            <div className="pt-2 border-t mt-2">
              <div className="flex justify-between">
                <span>Total Cost:</span>
                <span>{formatPrice(
                  standardJetTotalCost +
                  (selection.includeJetPump ? JET_PUMP_COST : 0) +
                  (selection.includeRoundPoolUpgrade ? ROUND_POOL_UPGRADE_COST : 0) +
                  (selection.includePepperPots ? PEPPER_POTS_COST : 0)
                )}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Margin:</span>
                <span>{formatPrice(
                  standardJetTotalMargin +
                  (selection.includeJetPump ? JET_PUMP_MARGIN : 0) +
                  (selection.includeRoundPoolUpgrade ? ROUND_POOL_UPGRADE_MARGIN : 0) +
                  (selection.includePepperPots ? PEPPER_POTS_MARGIN : 0)
                )}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Price:</span>
                <span>{formatPrice(
                  standardJetTotalPrice +
                  (selection.includeJetPump ? JET_PUMP_PRICE : 0) +
                  (selection.includeRoundPoolUpgrade ? ROUND_POOL_UPGRADE_PRICE : 0) +
                  (selection.includePepperPots ? PEPPER_POTS_PRICE : 0)
                )}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
