
import React from "react";
import { FiltrationComponent } from "@/types/filtration";
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

interface HandoverKitsSectionProps {
  handoverKits: FiltrationComponent[] | undefined;
  onAddClick: () => void;
}

export function HandoverKitsSection({
  handoverKits,
  onAddClick,
}: HandoverKitsSectionProps) {
  const kitComponents = {
    "KITPOOL11M": [
      { model_number: "KITPOOL11M", name: "11M Handover Kit", price: 136.13 },
      { model_number: "IQSU4000", name: "Theralux Startup Kit", price: 80.04 },
      { model_number: "IPEM6015", name: "1 x 15KG Enhance Minerals", price: 61.12 },
      { model_number: "ETMT7001", name: "Theralux Mineral Test Strip", price: 33.00 },
      { model_number: "ABC", name: "Telescopic Pole", price: 20.00 },
    ]
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Handover Kits</CardTitle>
        <Button onClick={onAddClick}>
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
              <React.Fragment key={kit.id}>
                <TableRow className="bg-muted/30 font-medium">
                  <TableCell className="font-bold">{kit.model_number}</TableCell>
                  <TableCell className="font-bold">{kit.name}</TableCell>
                  <TableCell className="font-bold">{kit.description || '-'}</TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(kit.price)}
                  </TableCell>
                </TableRow>
                {kitComponents[kit.model_number as keyof typeof kitComponents]?.map((component, index) => (
                  <TableRow key={`${kit.id}-${index}`} className="text-sm">
                    <TableCell className="pl-8">{component.model_number}</TableCell>
                    <TableCell>{component.name}</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(component.price)}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
