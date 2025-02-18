
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { AddHandoverKitPackageForm } from "./AddHandoverKitPackageForm";
import type { HandoverKitPackage, HandoverKitPackageComponent, FiltrationComponent } from "@/types/filtration";

interface HandoverKitPackagesSectionProps {
  onAddClick: () => void;
}

export function HandoverKitPackagesSection({
  onAddClick,
}: HandoverKitPackagesSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: handoverComponents } = useQuery({
    queryKey: ["handover-components"],
    queryFn: async () => {
      const { data: typeData, error: typeError } = await supabase
        .from("filtration_component_types")
        .select("id")
        .eq("name", "Handover Kit")
        .single();

      if (typeError) throw typeError;

      const { data, error } = await supabase
        .from("filtration_components")
        .select("*")
        .eq("type_id", typeData.id)
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages?.map((pkg) => (
              <React.Fragment key={pkg.id}>
                <TableRow className="bg-muted/30">
                  <TableCell className="font-bold">{pkg.name}</TableCell>
                  <TableCell>
                    {pkg.components?.length || 0} items
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(
                      pkg.components?.reduce(
                        (total, comp) => 
                          total + (comp.component?.price || 0) * comp.quantity,
                        0
                      ) || 0
                    )}
                  </TableCell>
                </TableRow>
                {pkg.components?.map((comp) => (
                  <TableRow key={comp.id} className="text-sm">
                    <TableCell className="pl-8">
                      {comp.component?.model_number}
                    </TableCell>
                    <TableCell>
                      {comp.component?.name} (x{comp.quantity})
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency((comp.component?.price || 0) * comp.quantity)}
                    </TableCell>
                  </TableRow>
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
      </CardContent>
    </Card>
  );
}
