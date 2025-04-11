import { useState, useEffect } from "react";
import { 
  useHeatPumpProducts, 
  type HeatPumpProduct 
} from "@/hooks/useHeatPumpProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Edit2, 
  Trash2, 
  Search, 
  Plus 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/utils/format";
import { AddHeatPumpForm } from "./AddHeatPumpForm";
import { HeatPumpSeedData } from "./HeatPumpSeedData";

export const HeatPumpProductsTable = () => {
  const { 
    heatPumpProducts, 
    isLoading, 
    fetchHeatPumpProducts, 
    addHeatPumpProduct, 
    updateHeatPumpProduct, 
    deleteHeatPumpProduct 
  } = useHeatPumpProducts();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<HeatPumpProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<HeatPumpProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHeatPumpProducts();
  }, []);

  const handleAddProduct = async (product: Omit<HeatPumpProduct, "id" | "created_at">) => {
    await addHeatPumpProduct(product);
  };

  const handleEditProduct = (product: HeatPumpProduct) => {
    setEditingProduct(product);
    setIsAddDialogOpen(true);
  };

  const handleUpdateProduct = async (product: Omit<HeatPumpProduct, "id" | "created_at">) => {
    if (editingProduct) {
      await updateHeatPumpProduct(editingProduct.id, product);
    }
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      await deleteHeatPumpProduct(productToDelete.id);
      setProductToDelete(null);
    }
  };

  // Filter products based on search term
  const filteredProducts = heatPumpProducts.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.hp_sku.toLowerCase().includes(searchLower) ||
      product.hp_description.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading && heatPumpProducts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading heat pump products...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search heat pumps..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {heatPumpProducts.length === 0 && <HeatPumpSeedData />}
          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsAddDialogOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Heat Pump
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right">RRP</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono">{product.hp_sku}</TableCell>
                    <TableCell>{product.hp_description}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.cost)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.margin)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.rrp)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setProductToDelete(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchTerm ? "No matching heat pump products found" : "No heat pump products added yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Product Form Dialog */}
      <AddHeatPumpForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
        initialValues={editingProduct}
        isEditMode={!!editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the heat pump product{" "}
              <span className="font-semibold">{productToDelete?.hp_sku}</span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
