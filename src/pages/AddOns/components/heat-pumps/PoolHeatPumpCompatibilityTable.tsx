
import { useState, useEffect } from "react";
import { useHeatPumpCompatibility, type HeatPumpCompatibility } from "@/hooks/useHeatPumpCompatibility";
import { useHeatPumpProducts } from "@/hooks/useHeatPumpProducts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Pencil } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { EditHeatPumpCompatibilityModal } from "./components/EditHeatPumpCompatibilityModal";

export const PoolHeatPumpCompatibilityTable = () => {
  const { 
    compatibility, 
    isLoading, 
    fetchCompatibility,
    updateCompatibility
  } = useHeatPumpCompatibility();
  
  const { 
    heatPumpProducts, 
    isLoading: isLoadingProducts, 
    fetchHeatPumpProducts 
  } = useHeatPumpProducts();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRecord, setEditingRecord] = useState<HeatPumpCompatibility | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchCompatibility();
    fetchHeatPumpProducts();
  }, []);

  // Filter compatibility based on search term
  const filteredCompatibility = compatibility.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.pool_range.toLowerCase().includes(searchLower) ||
      item.pool_model.toLowerCase().includes(searchLower) ||
      item.hp_sku.toLowerCase().includes(searchLower) ||
      item.hp_description.toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (record: HeatPumpCompatibility) => {
    setEditingRecord(record);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id: string, updates: { heat_pump_id: string, hp_sku: string, hp_description: string }) => {
    await updateCompatibility(id, updates);
    await fetchCompatibility(); // Refresh the data after update
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Pool Heat Pump Compatibility</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative max-w-xs">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search compatibility..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md pl-8"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool Range</TableHead>
                <TableHead>Pool Model</TableHead>
                <TableHead>Heat Pump SKU</TableHead>
                <TableHead>Heat Pump Description</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead className="text-right">RRP</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCompatibility.length > 0 ? (
                filteredCompatibility.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/30">
                    <TableCell>{item.pool_range}</TableCell>
                    <TableCell>{item.pool_model}</TableCell>
                    <TableCell className="font-mono">{item.hp_sku}</TableCell>
                    <TableCell>{item.hp_description}</TableCell>
                    <TableCell className="text-right">{item.cost ? formatCurrency(item.cost) : "-"}</TableCell>
                    <TableCell className="text-right">{item.rrp ? formatCurrency(item.rrp) : "-"}</TableCell>
                    <TableCell className="text-right">{item.margin ? formatCurrency(item.margin) : "-"}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => handleEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    {searchTerm ? "No matching compatibility records found" : "No compatibility records added yet"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditHeatPumpCompatibilityModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        record={editingRecord}
        heatPumpProducts={heatPumpProducts}
        onSave={handleSaveEdit}
      />
    </>
  );
};
