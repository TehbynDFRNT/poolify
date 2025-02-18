
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { EditFiltrationPackageForm } from "./EditFiltrationPackageForm";
import { AddFiltrationPackageForm } from "./AddFiltrationPackageForm";
import type { PackageWithComponents } from "@/types/filtration";
import { toast } from "sonner";

interface FiltrationPackagesSectionProps {
  packages: PackageWithComponents[] | undefined;
  onAddClick: () => void;
}

export function FiltrationPackagesSection({
  packages,
  onAddClick,
}: FiltrationPackagesSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageWithComponents | null>(null);
  const queryClient = useQueryClient();

  const calculateTotalPrice = (pkg: PackageWithComponents | undefined, useMediaFilter: boolean = false) => {
    if (!pkg) return 0;
    return (
      (pkg.light?.price || 0) +
      (pkg.pump?.price || 0) +
      (pkg.sanitiser?.price || 0) +
      (useMediaFilter ? (pkg.media_filter?.price || 0) : (pkg.standard_filter?.price || 0)) +
      (pkg.handover_kit?.price || 0)
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filtration Packages</CardTitle>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Package
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package</TableHead>
              <TableHead>Light</TableHead>
              <TableHead>Pool Pump</TableHead>
              <TableHead>Sanitiser</TableHead>
              <TableHead>Standard Filter</TableHead>
              <TableHead>Media Filter</TableHead>
              <TableHead>Handover Kit</TableHead>
              <TableHead className="text-right">Standard Total</TableHead>
              <TableHead className="text-right">Media Total</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages?.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium">Option {pkg.display_order}</TableCell>
                <TableCell>{pkg.light?.model_number || '-'}</TableCell>
                <TableCell>{pkg.pump?.model_number || '-'}</TableCell>
                <TableCell>{pkg.sanitiser?.model_number || '-'}</TableCell>
                <TableCell>{pkg.standard_filter?.model_number || '-'}</TableCell>
                <TableCell>{pkg.media_filter?.model_number || '-'}</TableCell>
                <TableCell>{pkg.handover_kit?.model_number || '-'}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(calculateTotalPrice(pkg))}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(calculateTotalPrice(pkg, true))}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingPackage(pkg)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AddFiltrationPackageForm
          open={showAddForm}
          onOpenChange={setShowAddForm}
        />

        {editingPackage && (
          <EditFiltrationPackageForm
            open={!!editingPackage}
            onOpenChange={(open) => !open && setEditingPackage(null)}
            package={editingPackage}
          />
        )}
      </CardContent>
    </Card>
  );
}
