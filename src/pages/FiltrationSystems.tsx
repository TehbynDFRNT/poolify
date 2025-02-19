import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { AddComponentForm } from "@/components/filtration/AddComponentForm";
import { FiltrationComponentsSection } from "@/components/filtration/FiltrationComponentsSection";
import { HandoverKitsSection } from "@/components/filtration/HandoverKitsSection";
import { HandoverKitPackagesSection } from "@/components/filtration/HandoverKitPackagesSection";
import { FiltrationPackagesSection } from "@/components/filtration/FiltrationPackagesSection";
import { PoolFiltrationMatchingTable } from "@/components/filtration/PoolFiltrationMatchingTable";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePoolPackages } from "@/hooks/usePoolPackages";
import type { FiltrationComponent, FiltrationComponentType, PackageWithComponents } from "@/types/filtration";

const FiltrationSystems = () => {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { poolsWithPackages, updatePoolPackageMutation } = usePoolPackages();

  const { data: componentTypes } = useQuery({
    queryKey: ["filtration-component-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("filtration_component_types")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as FiltrationComponentType[];
    },
  });

  const { data: components } = useQuery({
    queryKey: ["filtration-components", selectedTypeId],
    queryFn: async () => {
      let query = supabase
        .from("filtration_components")
        .select("*")
        .order("name");

      if (selectedTypeId) {
        query = query.eq("type_id", selectedTypeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as FiltrationComponent[];
    },
  });

  const { data: handoverKits } = useQuery({
    queryKey: ["handover-kits"],
    queryFn: async () => {
      const handoverKitType = componentTypes?.find(t => t.name === "Handover Kit");
      
      if (!handoverKitType) {
        console.log("Handover Kit type not found");
        return [];
      }

      const { data, error } = await supabase
        .from("filtration_components")
        .select("*")
        .eq("type_id", handoverKitType.id)
        .order("name");

      if (error) {
        console.error("Error fetching handover kits:", error);
        throw error;
      }

      return data as FiltrationComponent[];
    },
    enabled: !!componentTypes,
  });

  const { data: packages } = useQuery({
    queryKey: ["filtration-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("filtration_packages")
        .select(`
          id,
          name,
          display_order,
          created_at,
          light:filtration_components!light_id (
            id, name, model_number, price
          ),
          pump:filtration_components!pump_id (
            id, name, model_number, price
          ),
          sanitiser:filtration_components!sanitiser_id (
            id, name, model_number, price
          ),
          filter:filtration_components!filter_id (
            id, name, model_number, price
          ),
          handover_kit:handover_kit_packages!handover_kit_id (
            id, 
            name,
            components:handover_kit_package_components (
              id,
              quantity,
              package_id,
              component_id,
              created_at,
              component:filtration_components!component_id (
                id,
                name,
                model_number,
                price
              )
            )
          )
        `)
        .order("display_order");

      if (error) throw error;
      
      // Transform the data to match our expected types
      const transformedData: PackageWithComponents[] = (data || []).map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        display_order: pkg.display_order,
        light: pkg.light,
        pump: pkg.pump,
        sanitiser: pkg.sanitiser,
        filter: pkg.filter,
        handover_kit: pkg.handover_kit ? {
          id: pkg.handover_kit.id,
          name: pkg.handover_kit.name,
          components: pkg.handover_kit.components
        } : null
      }));

      return transformedData;
    },
  });

  const handleAddComponent = () => {
    const handoverKitType = componentTypes?.find(t => t.name === "Handover Kit");
    if (handoverKitType) {
      setSelectedTypeId(handoverKitType.id);
    }
    setShowAddForm(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            Filtration Systems
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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
        onUpdatePackage={(poolId, packageId) => {
          console.log('Updating package:', { poolId, packageId });
          updatePoolPackageMutation.mutate({ poolId, packageId });
        }}
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
