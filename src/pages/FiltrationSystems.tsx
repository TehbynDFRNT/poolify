import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { AddComponentForm } from "@/components/filtration/AddComponentForm";
import { FiltrationComponentsSection } from "@/components/filtration/FiltrationComponentsSection";
import { HandoverKitsSection } from "@/components/filtration/HandoverKitsSection";
import { HandoverKitPackagesSection } from "@/components/filtration/HandoverKitPackagesSection";
import { FiltrationPackagesSection } from "@/components/filtration/FiltrationPackagesSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import type { FiltrationComponent, FiltrationComponentType, PackageWithComponents } from "@/types/filtration";
import type { Pool } from "@/types/pool";

const FiltrationSystems = () => {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();

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
      const { data: ranges } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      const { data: poolsData, error } = await supabase
        .from("pool_specifications")
        .select(`
          id, 
          name, 
          range,
          default_filtration_package_id,
          default_package:filtration_packages!default_filtration_package_id (
            id,
            name,
            display_order,
            light:filtration_components!light_id (price),
            pump:filtration_components!pump_id (price),
            sanitiser:filtration_components!sanitiser_id (price),
            filter:filtration_components!filter_id (price),
            handover_kit:handover_kit_packages!handover_kit_id (
              components:handover_kit_package_components (
                quantity,
                component:filtration_components!component_id (price)
              )
            )
          )
        `)
        .order("range", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;

      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsData || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      });
    },
  });

  const updatePoolPackageMutation = useMutation({
    mutationFn: async ({ poolId, packageId }: { poolId: string; packageId: string }) => {
      const { error } = await supabase
        .from("pool_specifications")
        .update({ default_filtration_package_id: packageId })
        .eq("id", poolId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pools-with-packages"] });
    },
  });

  const calculatePackagePrice = (pkg: PackageWithComponents) => {
    const componentPrices = [
      pkg.light?.price || 0,
      pkg.pump?.price || 0,
      pkg.sanitiser?.price || 0,
      pkg.filter?.price || 0,
    ];

    const handoverKitPrice = pkg.handover_kit?.components.reduce((total, comp) => {
      return total + ((comp.component?.price || 0) * comp.quantity);
    }, 0) || 0;

    return componentPrices.reduce((sum, price) => sum + price, 0) + handoverKitPrice;
  };

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
          <CardTitle>Pool Filtration Matching</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Range</TableHead>
                <TableHead>Pool</TableHead>
                <TableHead>Default Package</TableHead>
                <TableHead className="text-right">Package Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {poolsWithPackages?.map((pool) => (
                <TableRow key={pool.id}>
                  <TableCell>{pool.range}</TableCell>
                  <TableCell>{pool.name}</TableCell>
                  <TableCell>
                    <Select
                      value={pool.default_filtration_package_id || ""}
                      onValueChange={(value) => {
                        updatePoolPackageMutation.mutate({
                          poolId: pool.id,
                          packageId: value,
                        });
                      }}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select package" />
                      </SelectTrigger>
                      <SelectContent>
                        {packages?.map((pkg) => (
                          <SelectItem key={pkg.id} value={pkg.id}>
                            Option {pkg.display_order}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    {pool.default_package ? formatCurrency(calculatePackagePrice(pool.default_package)) : "-"}
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
    </div>
  );
};

export default FiltrationSystems;
