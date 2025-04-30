
import { useState, useEffect } from "react";
import { useHeatPumpProducts, type HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import { useHeatPumpPoolCompatibility } from "@/hooks/useHeatPumpPoolCompatibility";
import { SearchBar } from "./components/SearchBar";
import { AddButton } from "./components/AddButton";
import { HeatPumpTable } from "./components/HeatPumpTable";
import { LoadingState } from "./components/LoadingState";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { AddHeatPumpForm } from "./AddHeatPumpForm";
import { HeatPumpTableHeader } from "./components/HeatPumpTableHeader";
import { ManageCompatibilityDialog } from "./components/ManageCompatibilityDialog";

export const HeatPumpProductsTable = () => {
  const { 
    heatPumpProducts, 
    isLoading, 
    fetchHeatPumpProducts, 
    addHeatPumpProduct, 
    updateHeatPumpProduct, 
    deleteHeatPumpProduct 
  } = useHeatPumpProducts();
  
  const { getPoolModelsByHeatPumpId } = useHeatPumpPoolCompatibility();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCompatibilityDialogOpen, setIsCompatibilityDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<HeatPumpProduct | null>(null);
  const [selectedHeatPump, setSelectedHeatPump] = useState<HeatPumpProduct | null>(null);
  const [productToDelete, setProductToDelete] = useState<HeatPumpProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [poolModelsByHeatPump, setPoolModelsByHeatPump] = useState<Record<string, { pool_range: string; pool_model: string }[]>>({});

  useEffect(() => {
    fetchHeatPumpProducts();
  }, []);

  // Fetch compatible pools for each heat pump
  useEffect(() => {
    const fetchCompatiblePools = async () => {
      const compatibilityData: Record<string, { pool_range: string; pool_model: string }[]> = {};
      
      for (const product of heatPumpProducts) {
        const poolModels = await getPoolModelsByHeatPumpId(product.id);
        compatibilityData[product.id] = poolModels;
      }
      
      setPoolModelsByHeatPump(compatibilityData);
    };
    
    if (heatPumpProducts.length > 0) {
      fetchCompatiblePools();
    }
  }, [heatPumpProducts]);

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

  const handleManageCompatibility = (product: HeatPumpProduct) => {
    setSelectedHeatPump(product);
    setIsCompatibilityDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (productToDelete) {
      setIsDeleting(true);
      await deleteHeatPumpProduct(productToDelete.id);
      setIsDeleting(false);
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
      <HeatPumpTableHeader title="Heat Pumps">
        <div className="flex items-center gap-2">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <AddButton 
            onClick={() => {
              setEditingProduct(null);
              setIsAddDialogOpen(true);
            }} 
          />
        </div>
      </HeatPumpTableHeader>

      <HeatPumpTable 
        products={filteredProducts} 
        searchTerm={searchTerm}
        onEdit={handleEditProduct}
        onDelete={setProductToDelete}
        onManageCompatibility={handleManageCompatibility}
        poolCompatibilities={poolModelsByHeatPump}
      />

      {/* Add/Edit Product Form Dialog */}
      <AddHeatPumpForm
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
        initialValues={editingProduct}
        isEditMode={!!editingProduct}
      />

      {/* Manage Compatibility Dialog */}
      <ManageCompatibilityDialog
        open={isCompatibilityDialogOpen}
        onOpenChange={setIsCompatibilityDialogOpen}
        heatPump={selectedHeatPump}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog 
        product={productToDelete}
        onOpenChange={() => setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
};
