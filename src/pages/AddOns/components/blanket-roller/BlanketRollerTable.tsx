
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Layers, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useBlanketRollers } from "@/hooks/useBlanketRollers";
import { BlanketRoller } from "@/types/blanket-roller";
import { BlanketRollerRow } from "./BlanketRollerRow";
import { AddBlanketRollerForm } from "./AddBlanketRollerForm";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { EmptyState } from "./components/EmptyState";
import { LoadingState } from "./components/LoadingState";

// Actual blanket roller data
const blanketRollerData = [
  { pool_range: "Piazza", pool_model: "Alto", sku: "IX-ALTO-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 1950, trade: 1503, margin: 447 },
  { pool_range: "Piazza", pool_model: "Latina", sku: "IX-LATINA-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 1950, trade: 1503, margin: 447 },
  { pool_range: "Piazza", pool_model: "Sovereign", sku: "IX-SOVEREIGN-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 1950, trade: 1503, margin: 447 },
  { pool_range: "Piazza", pool_model: "Empire", sku: "IX-EMPIRE-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Piazza", pool_model: "Oxford", sku: "IX-OXFORD-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Piazza", pool_model: "Avellino", sku: "IX-AVELLINO-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Piazza", pool_model: "Palazzo", sku: "IX-PALAZZO-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Piazza", pool_model: "Valentina", sku: "IX-VALENTINA-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2600, trade: 2103, margin: 497 },
  { pool_range: "Piazza", pool_model: "Westminster", sku: "IX-WESTMINSTER-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2600, trade: 2103, margin: 497 },
  { pool_range: "Piazza", pool_model: "Kensington", sku: "IX-KENSINGTON-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2900, trade: 2190, margin: 710 },
  { pool_range: "Latin", pool_model: "Verona", sku: "IX-VERONA-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 1950, trade: 1503, margin: 447 },
  { pool_range: "Latin", pool_model: "Portofino", sku: "IX-PORTOFINO-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 1950, trade: 1503, margin: 447 },
  { pool_range: "Latin", pool_model: "Florentina", sku: "IX-FLORENTINA-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 1950, trade: 1503, margin: 447 },
  { pool_range: "Latin", pool_model: "Bellagio", sku: "IX-BELLAGIO-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Contemporary", pool_model: "Bellino", sku: "IX-BELLINO-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Contemporary", pool_model: "Imperial", sku: "IX-IMPERIAL-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Contemporary", pool_model: "Castello", sku: "IX-CASTELLO-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Contemporary", pool_model: "Grandeur", sku: "IX-GRANDEUR-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2600, trade: 2103, margin: 497 },
  { pool_range: "Contemporary", pool_model: "Amalfi", sku: "IX-AMALFI-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2600, trade: 2103, margin: 497 },
  { pool_range: "Vogue", pool_model: "Serenity", sku: "IX-SERENITY-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 1950, trade: 1503, margin: 447 },
  { pool_range: "Vogue", pool_model: "Allure", sku: "IX-ALLURE-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 1950, trade: 1503, margin: 447 },
  { pool_range: "Vogue", pool_model: "Harmony", sku: "IX-HARMONY-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Villa", pool_model: "Istana", sku: "IX-ISTANA-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Villa", pool_model: "Terazza", sku: "IX-TERAZZA-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Villa", pool_model: "Elysian", sku: "IX-ELYSIAN-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Entertainer", pool_model: "Bedarra", sku: "IX-BEDARRA-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2300, trade: 1705, margin: 595 },
  { pool_range: "Entertainer", pool_model: "Hayman", sku: "IX-HAYMAN-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 2600, trade: 2103, margin: 497 },
  { pool_range: "Round Pools", pool_model: "Infinity 3", sku: "IX-INFINITY3-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 1950, trade: 1503, margin: 447 },
  { pool_range: "Round Pools", pool_model: "Infinity 4", sku: "IX-INFINITY4-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 1950, trade: 1503, margin: 447 },
  { pool_range: "Round Pools", pool_model: "Terrace 3", sku: "IX-TERRACE3-BR", description: "3mm Daisy Thermal Blanket in Foam Blue with Stainless Steel Roller", rrp: 1950, trade: 1503, margin: 447 }
];

export const BlanketRollerTable = () => {
  const { blanketRollers, isLoading, addBlanketRoller, deleteBlanketRoller } = useBlanketRollers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlanketRoller | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BlanketRoller | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Add the actual blanket roller data if none exists
  useEffect(() => {
    const addProductData = async () => {
      if (!isLoading && blanketRollers.length === 0 && !initialized) {
        setInitialized(true);
        
        // Insert in small batches to avoid overwhelming the API
        const batchSize = 5;
        for (let i = 0; i < blanketRollerData.length; i += batchSize) {
          const batch = blanketRollerData.slice(i, i + batchSize);
          await Promise.all(batch.map(product => addBlanketRoller(product)));
          
          // Small delay between batches to prevent potential rate limiting
          if (i + batchSize < blanketRollerData.length) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      }
    };

    addProductData();
  }, [isLoading, blanketRollers.length, initialized, addBlanketRoller]);

  const filteredItems = blanketRollers.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.pool_range.toLowerCase().includes(search) ||
      item.pool_model.toLowerCase().includes(search) ||
      item.sku.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });

  const handleEdit = (item: BlanketRoller) => {
    setEditingItem(item);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (item: BlanketRoller) => {
    setItemToDelete(item);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setIsDeleting(true);
      try {
        await deleteBlanketRoller(itemToDelete.id);
      } finally {
        setIsDeleting(false);
        setItemToDelete(null);
      }
    }
  };

  const handleFormClose = () => {
    setIsAddDialogOpen(false);
    setEditingItem(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (filteredItems.length === 0) {
      return <EmptyState searchTerm={searchTerm} />;
    }

    return filteredItems.map((item) => (
      <BlanketRollerRow 
        key={item.id}
        blanketRoller={item}
        onEdit={() => handleEdit(item)}
        onDelete={() => handleDelete(item)}
      />
    ));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle>Blanket & Roller</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Blanket & Roller</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool Range</TableHead>
                <TableHead>Pool Model</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">RRP</TableHead>
                <TableHead className="text-right">Trade</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderContent()}
            </TableBody>
          </Table>
        </div>

        <AddBlanketRollerForm 
          open={isAddDialogOpen} 
          onOpenChange={handleFormClose}
          initialValues={editingItem}
          isEditMode={!!editingItem}
        />

        <DeleteConfirmDialog 
          blanketRoller={itemToDelete}
          onOpenChange={() => setItemToDelete(null)}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
      </CardContent>
    </Card>
  );
};
