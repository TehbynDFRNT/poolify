
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

interface DeckJet {
  id: string;
  cost_price: number;
  margin: number;
  total: number;
  description: string;
  model_number: string;
  quantity?: number; // Made quantity optional
}

interface DeckJetsSelection {
  deckJetsPackage: string;
}

interface DeckJetsSectionProps {
  pool: Pool;
  customerId: string | null;
  onSelectionChange?: (totals: {
    totalPrice: number;
    totalCost: number;
    totalMargin: number;
  }) => void;
}

export const DeckJetsSection: React.FC<DeckJetsSectionProps> = ({ 
  pool, 
  customerId,
  onSelectionChange 
}) => {
  const [deckJets, setDeckJets] = useState<DeckJet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selection, setSelection] = useState<DeckJetsSelection>({
    deckJetsPackage: "none"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDeckJets();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [selection, deckJets]);

  const fetchDeckJets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('deck_jets')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Map the database results to include a derived quantity property
      const mappedData = data?.map(jet => ({
        ...jet,
        quantity: parseInt(jet.model_number.split('-')[0]) || 0 // Extract quantity from model_number or set to 0
      })) || [];
      
      setDeckJets(mappedData);
    } catch (error: any) {
      console.error("Error fetching deck jets:", error);
      toast({
        title: "Error loading deck jets",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotals = () => {
    if (deckJets.length === 0) return;

    let totalPrice = 0;
    let totalCost = 0;
    let totalMargin = 0;

    // If a package is selected, find its costs
    if (selection.deckJetsPackage !== "none") {
      const selectedJets = deckJets.find(jet => jet.quantity?.toString() === selection.deckJetsPackage);
      
      if (selectedJets) {
        totalPrice = selectedJets.total;
        totalCost = selectedJets.cost_price;
        totalMargin = selectedJets.margin;
      }
    }

    if (onSelectionChange) {
      onSelectionChange({
        totalPrice,
        totalCost,
        totalMargin
      });
    }
  };

  const handlePackageChange = (value: string) => {
    setSelection(prev => ({
      ...prev,
      deckJetsPackage: value
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
          <p className="text-center text-muted-foreground">Loading deck jet options...</p>
        </CardContent>
      </Card>
    );
  }

  // Get the selected package information
  const selectedPackage = selection.deckJetsPackage !== "none" 
    ? deckJets.find(jet => jet.quantity?.toString() === selection.deckJetsPackage) 
    : null;

  return (
    <Card className="bg-white mt-6">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          <CardTitle>Deck Jets</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Deck Jet Package Selection */}
        <div className="space-y-3">
          <Label htmlFor="deck-jets-package">Select Deck Jets Package</Label>
          <Select 
            value={selection.deckJetsPackage} 
            onValueChange={handlePackageChange}
          >
            <SelectTrigger id="deck-jets-package" className="w-full">
              <SelectValue placeholder="Select a package" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {deckJets.map((jet) => (
                <SelectItem key={jet.id} value={jet.quantity?.toString() || "0"}>
                  {jet.quantity} Jets - {formatPrice(jet.total)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedPackage && (
            <div className="pt-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package:</span>
                <span>{selectedPackage.description}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Price:</span>
                <span>{formatPrice(selectedPackage.total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Total Summary */}
        {selectedPackage && (
          <div className="mt-6 p-4 border rounded-lg bg-slate-50">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Deck Jets Package:</span>
                <span>{formatPrice(selectedPackage.total)}</span>
              </div>
              
              <div className="pt-2 border-t mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatPrice(selectedPackage.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

