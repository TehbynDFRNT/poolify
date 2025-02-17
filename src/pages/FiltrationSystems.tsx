import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { AddComponentForm } from "@/components/filtration/AddComponentForm";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import type { FiltrationComponent, FiltrationComponentType, FiltrationPackage } from "@/types/filtration";

// Define the type for package with its relations
type PackageWithComponents = Omit<FiltrationPackage, 'light_id' | 'pump_id' | 'sanitiser_id' | 'standard_filter_id' | 'media_filter_id' | 'handover_kit_id'> & {
  light: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'> | null;
  pump: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'> | null;
  sanitiser: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'> | null;
  standard_filter: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'> | null;
  media_filter: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'> | null;
  handover_kit: Pick<FiltrationComponent, 'name' | 'model_number' | 'price'> | null;
};

const FiltrationSystems = () => {
  const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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

  // Add a new query specifically for handover kits
  const { data: handoverKits } = useQuery({
    queryKey: ["handover-kits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("filtration_components")
        .select("*")
        .eq("type_id", componentTypes?.find(t => t.name === "Handover Kit")?.id)
        .order("name");

      if (error) throw error;
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
          light:filtration_components!light_id(name, model_number, price),
          pump:filtration_components!pump_id(name, model_number, price),
          sanitiser:filtration_components!sanitiser_id(name, model_number, price),
          standard_filter:filtration_components!standard_filter_id(name, model_number, price),
          media_filter:filtration_components!media_filter_id(name, model_number, price),
          handover_kit:filtration_components!handover_kit_id(name, model_number, price)
        `)
        .order("display_order");

      if (error) throw error;
      return data as PackageWithComponents[];
    },
  });

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

      {/* Components Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filtration Components</CardTitle>
          <div className="flex gap-4">
            <select
              className="px-4 py-2 border rounded-md"
              value={selectedTypeId || ""}
              onChange={(e) => setSelectedTypeId(e.target.value || null)}
            >
              <option value="">All Components</option>
              {componentTypes?.filter(type => type.name !== "Handover Kit").map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Component
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Flow Rate</TableHead>
                <TableHead className="text-right">Power Usage</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {components?.filter(component => 
                componentTypes?.find(t => t.id === component.type_id)?.name !== "Handover Kit"
              ).map((component) => (
                <TableRow key={component.id}>
                  <TableCell className="font-medium">{component.model_number}</TableCell>
                  <TableCell>{component.name}</TableCell>
                  <TableCell>
                    {componentTypes?.find(t => t.id === component.type_id)?.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {component.flow_rate ? `${component.flow_rate} L/min` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {component.power_consumption ? `${component.power_consumption}W` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(component.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Handover Kits Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Handover Kits</CardTitle>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Handover Kit
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {handoverKits?.map((kit) => (
                <TableRow key={kit.id}>
                  <TableCell className="font-medium">{kit.model_number}</TableCell>
                  <TableCell>{kit.name}</TableCell>
                  <TableCell>{kit.description || '-'}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(kit.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Packages Section */}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages?.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">Option {pkg.display_order}</TableCell>
                  <TableCell>{pkg.light?.model_number}</TableCell>
                  <TableCell>{pkg.pump?.model_number}</TableCell>
                  <TableCell>{pkg.sanitiser?.model_number}</TableCell>
                  <TableCell>{pkg.standard_filter?.model_number}</TableCell>
                  <TableCell>{pkg.media_filter?.model_number}</TableCell>
                  <TableCell>{pkg.handover_kit?.model_number}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(calculateTotalPrice(pkg))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(calculateTotalPrice(pkg, true))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Component Form Dialog */}
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
