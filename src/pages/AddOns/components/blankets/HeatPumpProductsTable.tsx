
import { useState } from "react";
import { usePoolBlankets } from "@/hooks/usePoolBlankets";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import { AddPoolBlanketForm } from "./AddPoolBlanketForm";
import { PoolBlanket } from "@/types/pool-blanket";

export const HeatPumpProductsTable = () => {
  const { poolBlankets, isLoading, deletePoolBlanket } = usePoolBlankets();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBlanket, setEditingBlanket] = useState<PoolBlanket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteBlanket = (id: string) => {
    if (window.confirm("Are you sure you want to delete this heat pump?")) {
      deletePoolBlanket(id);
    }
  };

  const handleEditBlanket = (blanket: PoolBlanket) => {
    setEditingBlanket(blanket);
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingBlanket(null);
  };

  // Filter blankets based on search term
  const filteredPoolBlankets = poolBlankets?.filter(blanket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      blanket.heatpump_sku.toLowerCase().includes(searchLower) ||
      blanket.heatpump_description.toLowerCase().includes(searchLower) ||
      blanket.pool_model.toLowerCase().includes(searchLower) ||
      blanket.pool_range.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading heat pumps...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search heat pumps..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="mt-2 sm:mt-0"
        >
          Add New Heat Pump
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Compatible Pool Models</TableHead>
                <TableHead className="text-right">RRP</TableHead>
                <TableHead className="text-right">Trade Price</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPoolBlankets?.length ? (
                filteredPoolBlankets.map((blanket) => (
                  <TableRow key={blanket.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-mono text-sm">{blanket.heatpump_sku}</TableCell>
                    <TableCell>{blanket.heatpump_description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {blanket.pool_range}: {blanket.pool_model}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(blanket.heatpump_rrp)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(blanket.heatpump_trade)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(blanket.heatpump_margin)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleEditBlanket(blanket)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDeleteBlanket(blanket.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {searchTerm ? "No matching heat pumps found" : "No heat pumps added yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddPoolBlanketForm 
        open={isAddDialogOpen} 
        onOpenChange={handleCloseDialog} 
        editBlanket={editingBlanket}
      />
    </div>
  );
};
