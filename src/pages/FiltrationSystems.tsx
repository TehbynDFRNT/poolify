
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
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

interface FiltrationSystem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  flow_rate: number | null;
  power_consumption: number | null;
  created_at: string;
}

const FiltrationSystems = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: filtrationSystems, isLoading } = useQuery({
    queryKey: ["filtration-systems"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("filtration_systems")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as FiltrationSystem[];
    },
  });

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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filtration Components</CardTitle>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Component
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Flow Rate</TableHead>
                <TableHead className="text-right">Power Usage</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtrationSystems?.map((system) => (
                <TableRow key={system.id}>
                  <TableCell className="font-medium">{system.name}</TableCell>
                  <TableCell>{system.description}</TableCell>
                  <TableCell className="text-right">
                    {system.flow_rate ? `${system.flow_rate} L/min` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {system.power_consumption ? `${system.power_consumption}W` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(system.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FiltrationSystems;
