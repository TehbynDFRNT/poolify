
import { useState, useEffect } from "react";
import { useHeatPumpProducts, type HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import { SearchBar } from "./components/SearchBar";
import { AddButton } from "./components/AddButton";
import { HeatPumpTable } from "./components/HeatPumpTable";
import { LoadingState } from "./components/LoadingState";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { AddHeatPumpForm } from "./AddHeatPumpForm";

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

  // Use the form values directly and calculate margin based on cost and rrp
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
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <AddButton 
          onClick={() => {
            setEditingProduct(null);
            setIsAddDialogOpen(true);
          }} 
        />
      </div>

      <HeatPumpTable 
        products={filteredProducts} 
        searchTerm={searchTerm}
        onEdit={handleEditProduct}
        onDelete={setProductToDelete}
      />

      {/* Add/Edit Product Form Dialog */}
      <AddHeatPumpForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
        initialValues={editingProduct}
        isEditMode={!!editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog 
        product={productToDelete}
        onOpenChange={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
