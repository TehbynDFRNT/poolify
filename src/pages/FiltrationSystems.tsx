
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { AddComponentForm } from "@/components/filtration/AddComponentForm";
import { FiltrationComponentsSection } from "@/components/filtration/FiltrationComponentsSection";
import { HandoverKitsSection } from "@/components/filtration/HandoverKitsSection";
import { HandoverKitPackagesSection } from "@/components/filtration/HandoverKitPackagesSection";
import { FiltrationPackagesSection } from "@/components/filtration/FiltrationPackagesSection";
import { EditFiltrationPackageForm } from "@/components/filtration/EditFiltrationPackageForm";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { FiltrationComponent, FiltrationComponentType, PackageWithComponents } from "@/types/filtration";

const FiltrationSystems = () => {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageWithComponents | null>(null);

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
      return data as unknown as PackageWithComponents[];
    },
  });

  const { data: poolsWithPackages } = useQuery({
    queryKey: ["pools-with-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select(`
          id,
          name,
          standard_filtration_package:filtration_packages!standard_filtration_package_id(
            id,
            name,
            display_order
          )
        `)
        .order('name');

      if (error) throw error;
      return data;
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

      <Card>
        <CardHeader>
          <CardTitle>Pool Filtration Package Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool Name</TableHead>
                <TableHead>Standard Filtration Package</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poolsWithPackages?.map((pool) => (
                <TableRow key={pool.id}>
                  <TableCell>{pool.name}</TableCell>
                  <TableCell>
                    {pool.standard_filtration_package?.name || 'Not set'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (packages) {
                          const pkg = packages.find(p => p.id === pool.standard_filtration_package?.id);
                          if (pkg) {
                            setEditingPackage(pkg);
                          }
                        }
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {componentTypes && (
        <AddComponentForm
          open={showAddForm}
          onOpenChange={setShowAddForm}
          componentTypes={componentTypes}
        />
      )}

      {editingPackage && (
        <EditFiltrationPackageForm
          open={!!editingPackage}
          onOpenChange={(open) => !open && setEditingPackage(null)}
          package={editingPackage}
        />
      )}
    </div>
  );
};

export default FiltrationSystems;
