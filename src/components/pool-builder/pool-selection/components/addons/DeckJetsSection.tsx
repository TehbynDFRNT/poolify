
import React, { useState, useEffect } from "react";
import { Pool } from "@/types/pool";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Droplet, Search, Plus, Edit, Trash2 } from "lucide-react";
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
  selectedJetId: string | null;
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
    deckJetsPackage: "none",
    selectedJetId: null
  });
  const [searchTerm, setSearchTerm] = useState("");
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
    if (selection.selectedJetId) {
      const selectedJets = deckJets.find(jet => jet.id === selection.selectedJetId);
      
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

  const handleJetSelection = (jetId: string) => {
    setSelection(prev => ({
      ...prev,
      selectedJetId: jetId,
      deckJetsPackage: deckJets.find(jet => jet.id === jetId)?.quantity?.toString() || "none"
    }));
  };

  const filteredDeckJets = deckJets.filter(jet => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (jet.quantity?.toString() || "").includes(search) ||
      jet.description.toLowerCase().includes(search) ||
      jet.model_number.toLowerCase().includes(search)
    );
  });

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Card className="bg-white mt-6">
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading deck jet options...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Droplet className="h-5 w-5 text-primary" />
            <CardTitle>Deck Jets</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search deck jets..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Deck Jet</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeckJets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No deck jets found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDeckJets.map((jet) => (
                  <TableRow 
                    key={jet.id}
                    className={selection.selectedJetId === jet.id ? "bg-primary/10" : undefined}
                    onClick={() => handleJetSelection(jet.id)}
                  >
                    <TableCell>{jet.quantity} Jets</TableCell>
                    <TableCell className="text-right">${jet.cost_price.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${jet.margin.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${jet.total.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Selection Summary */}
        {selection.selectedJetId && (
          <div className="mt-6 p-4 border rounded-lg bg-slate-50">
            <h4 className="font-medium mb-2">Selected Package</h4>
            <div className="space-y-2">
              {deckJets
                .filter(jet => jet.id === selection.selectedJetId)
                .map(selectedJet => (
                  <div key={selectedJet.id}>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Description:</span>
                      <span>{selectedJet.description}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost:</span>
                      <span>{formatPrice(selectedJet.cost_price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Margin:</span>
                      <span>{formatPrice(selectedJet.margin)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>{formatPrice(selectedJet.total)}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
