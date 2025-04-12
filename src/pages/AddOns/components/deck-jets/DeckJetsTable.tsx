
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/format";

// Type for deck jets data
interface DeckJet {
  id: string;
  model_number: string;
  description: string;
  cost_price: number;
  margin: number;
  total: number;
  quantity?: number;
  created_at?: string;
}

export const DeckJetsTable = () => {
  const [deckJets, setDeckJets] = useState<DeckJet[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDeckJets();
  }, []);

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

  const handleAddClick = () => {
    toast({
      title: "Add Deck Jet",
      description: "This feature will be implemented soon.",
    });
  };

  const handleEditClick = (jet: DeckJet) => {
    toast({
      title: "Edit Deck Jet",
      description: `Editing ${jet.quantity} Jets package`,
    });
  };

  const handleDeleteClick = (jet: DeckJet) => {
    toast({
      title: "Delete Deck Jet",
      description: `Deleting ${jet.quantity} Jets package`,
    });
  };

  const filteredDeckJets = deckJets.filter((jet) => {
    const search = searchTerm.toLowerCase();
    return (
      (jet.quantity?.toString() || "").includes(search) ||
      jet.description.toLowerCase().includes(search) ||
      jet.model_number.toLowerCase().includes(search)
    );
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Droplet className="h-5 w-5 text-primary" />
          <CardTitle>Deck Jets</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* No duplicate title here */}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search deck jets..."
                  className="pl-8 w-[200px] md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="flex items-center gap-2" onClick={handleAddClick}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Deck Jet</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading deck jets...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredDeckJets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      {searchTerm ? "No deck jets match your search." : "No deck jets found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeckJets.map((jet) => (
                    <TableRow key={jet.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>{jet.quantity} Jets</TableCell>
                      <TableCell>{jet.description}</TableCell>
                      <TableCell className="text-right">{formatCurrency(jet.cost_price)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(jet.margin)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(jet.total)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditClick(jet)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteClick(jet)}
                          >
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
        </div>
      </CardContent>
    </Card>
  );
};
