
import { useState } from "react";
import { toast } from "sonner";
import { AddComponentForm } from "@/components/filtration/AddComponentForm";
import { FiltrationComponentsSection } from "@/components/filtration/FiltrationComponentsSection";
import { HandoverKitsSection } from "@/components/filtration/HandoverKitsSection";
import { HandoverKitPackagesSection } from "@/components/filtration/HandoverKitPackagesSection";
import { FiltrationPackagesSection } from "@/components/filtration/FiltrationPackagesSection";
import { PoolFiltrationMatchingTable } from "@/components/filtration/PoolFiltrationMatchingTable";
import { FiltrationPageHeader } from "@/components/filtration/FiltrationPageHeader";
import { usePoolPackages } from "@/hooks/usePoolPackages";
import { useFiltrationQueries } from "@/hooks/useFiltrationQueries";

const FiltrationSystems = () => {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const { poolsWithPackages, isLoading, updatePoolPackageMutation } = usePoolPackages();
  const { 
    componentTypes, 
    components, 
    handoverKits, 
    packages,
  } = useFiltrationQueries(selectedTypeId);

  const handleAddComponent = () => {
    const handoverKitType = componentTypes?.find(t => t.name === "Handover Kit");
    if (handoverKitType) {
      setSelectedTypeId(handoverKitType.id);
    }
    setShowAddForm(true);
  };

  const handleUpdatePackage = (poolId: string, packageId: string) => {
    console.log('Updating package:', { poolId, packageId }); // Debug log
    updatePoolPackageMutation.mutate(
      { poolId, packageId },
      {
        onSuccess: () => {
          console.log('Package updated successfully'); // Debug log
          toast.success("Package updated successfully");
        },
        onError: (error) => {
          console.error("Error updating package:", error);
          toast.error("Failed to update package");
        },
      }
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <FiltrationPageHeader />

      <FiltrationComponentsSection
        components={components}
        componentTypes={componentTypes}
        selectedTypeId={selectedTypeId}
        onTypeChange={setSelectedTypeId}
        onAddClick={() => setShowAddForm(true)}
      />

      <HandoverKitsSection
        handoverKits={handoverKits}
        onAddClick={handleAddComponent}
      />

      <HandoverKitPackagesSection
        onAddClick={() => setShowAddForm(true)}
      />

      <FiltrationPackagesSection
        packages={packages}
        onAddClick={() => setShowAddForm(true)}
      />

      <PoolFiltrationMatchingTable
        pools={poolsWithPackages || []}
        packages={packages}
        onUpdatePackage={handleUpdatePackage}
        isLoading={isLoading}
        isUpdating={updatePoolPackageMutation.isPending}
      />

      {componentTypes && (
        <AddComponentForm
          open={showAddForm}
          onOpenChange={setShowAddForm}
          componentTypes={componentTypes}
        />
      )}
    </div>
  );
};

export default FiltrationSystems;
