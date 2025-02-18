
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddHandoverKitPackageForm } from "./AddHandoverKitPackageForm";
import { EditHandoverKitPackageForm } from "./EditHandoverKitPackageForm";
import { PackageHeaderRow } from "./handover-kit-packages/PackageHeaderRow";
import { PackageComponentRow } from "./handover-kit-packages/PackageComponentRow";
import type { HandoverKitPackage, HandoverKitPackageComponent, FiltrationComponent } from "@/types/filtration";
import { toast } from "sonner";

interface HandoverKitPackagesSectionProps {
  onAddClick: () => void;
}

export function HandoverKitPackagesSection({
  onAddClick,
}: HandoverKitPackagesSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<HandoverKitPackage & { components: HandoverKitPackageComponent[] } | null>(null);
  const [editingComponent, setEditingComponent] = useState<{ packageId: string; componentId: string; quantity: number } | null>(null);
  const queryClient = useQueryClient();

  const { data: handoverComponents } = useQuery({
    queryKey: ["handover-components"],
    queryFn: async () => {
      // Get all types named "Handover Kit"
      const { data: typeData, error: typeError } = await supabase
        .from("filtration_component_types")
        .select("id")
        .eq("name", "Handover Kit");

      if (typeError) throw typeError;
      if (!typeData?.length) return []; // Handle case where no types are found

      // Get components for all handover kit types
      const { data, error } = await supabase
        .from("filtration_components")
        .select("*")
        .in("type_id", typeData.map(t => t.id))
        .order("name");

      if (error) throw error;
      return data as FiltrationComponent[];
    },
  });

  const { data: packages } = useQuery({
    queryKey: ["handover-kit-packages"],
    queryFn: async () => {
      const { data: packagesData, error: packagesError } = await supabase
        .from("handover_kit_packages")
        .select("*")
        .order("display_order");

      if (packagesError) throw packagesError;

      const packages = packagesData as HandoverKitPackage[];
      
      // Fetch components for each package
      const packagesWithComponents = await Promise.all(
        packages.map(async (pkg) => {
          const { data: componentsData, error: componentsError } = await supabase
            .from("handover_kit_package_components")
            .select(`
              *,
              component:filtration_components(name, model_number, price)
            `)
            .eq("package_id", pkg.id);

          if (componentsError) throw componentsError;

          return {
            ...pkg,
            components: componentsData as HandoverKitPackageComponent[],
          };
        })
      );

      return packagesWithComponents;
    },
  });

  const handleUpdateQuantity = async (packageId: string, componentId: string, newQuantity: number) => {
    try {
      const { error } = await supabase
        .from("handover_kit_package_components")
        .update({ quantity: newQuantity })
        .eq("package_id", packageId)
        .eq("component_id", componentId);

      if (error) throw error;

      toast.success("Component quantity updated");
      queryClient.invalidateQueries({ queryKey: ["handover-kit-packages"] });
      setEditingComponent(null);
    } catch (error) {
      console.error("Error updating component quantity:", error);
      toast.error("Failed to update component quantity");
    }
  };

  const handleStartEdit = (packageId: string, componentId: string, quantity: number) => {
    setEditingComponent({ packageId, componentId, quantity });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Handover Kit Packages</CardTitle>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Package
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package Name</TableHead>
              <TableHead>Components</TableHead>
              <TableHead className="text-right">Total Price</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages?.map((pkg) => (
              <React.Fragment key={pkg.id}>
                <PackageHeaderRow
                  pkg={pkg}
                  onEdit={setEditingPackage}
                />
                {pkg.components?.map((comp) => (
                  <PackageComponentRow
                    key={comp.id}
                    component={comp}
                    packageId={pkg.id}
                    editingComponent={editingComponent}
                    onStartEdit={handleStartEdit}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>

        {handoverComponents && (
          <AddHandoverKitPackageForm
            open={showAddForm}
            onOpenChange={setShowAddForm}
            availableComponents={handoverComponents}
          />
        )}

        {editingPackage && handoverComponents && (
          <EditHandoverKitPackageForm
            open={!!editingPackage}
            onOpenChange={(open) => !open && setEditingPackage(null)}
            package={editingPackage}
            availableComponents={handoverComponents}
          />
        )}
      </CardContent>
    </Card>
  );
}
