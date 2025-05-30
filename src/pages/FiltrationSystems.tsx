import { DashboardLayout } from "@/components/DashboardLayout";
import { AddComponentForm } from "@/components/filtration/AddComponentForm";
import { FiltrationComponentsSection } from "@/components/filtration/FiltrationComponentsSection";
import { FiltrationPackagesSection } from "@/components/filtration/FiltrationPackagesSection";
import { FiltrationPageHeader } from "@/components/filtration/FiltrationPageHeader";
import { HandoverKitPackagesSection } from "@/components/filtration/HandoverKitPackagesSection";
import { HandoverKitsSection } from "@/components/filtration/HandoverKitsSection";
import { PoolFiltrationMatchingTable } from "@/components/filtration/PoolFiltrationMatchingTable";
import { FiltrationSystemsHeader } from "@/components/headers/FiltrationSystemsHeader";
import { useFiltrationQueries } from "@/hooks/useFiltrationQueries";
import { usePoolPackages } from "@/hooks/usePoolPackages";
import { useState } from "react";
import { toast } from "sonner";

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
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <FiltrationSystemsHeader />

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
    </DashboardLayout>
  );
};

export default FiltrationSystems;
