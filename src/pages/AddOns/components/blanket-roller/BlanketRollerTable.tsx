
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Layers, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useBlanketRollers } from "@/hooks/useBlanketRollers";
import { BlanketRoller } from "@/types/blanket-roller";
import { BlanketRollerRow } from "./BlanketRollerRow";
import { AddBlanketRollerForm } from "./AddBlanketRollerForm";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

export const BlanketRollerTable = () => {
  const { blanketRollers, isLoading, deleteBlanketRoller } = useBlanketRollers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlanketRoller | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BlanketRoller | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredItems = blanketRollers.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.pool_range.toLowerCase().includes(search) ||
      item.pool_model.toLowerCase().includes(search) ||
      item.sku.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });

  const handleEdit = (item: BlanketRoller) => {
    setEditingItem(item);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (item: BlanketRoller) => {
    setItemToDelete(item);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      setIsDeleting(true);
      try {
        await deleteBlanketRoller(itemToDelete.id);
      } finally {
        setIsDeleting(false);
        setItemToDelete(null);
      }
    }
  };

  const handleFormClose = () => {
    setIsAddDialogOpen(false);
    setEditingItem(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-32 text-center">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="my-2 text-sm animate-pulse">Loading blanket & roller data...</div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="h-32 text-center">
            <div className="flex flex-col items-center justify-center space-y-1 py-4 text-muted-foreground">
              <Layers className="h-10 w-10 text-muted-foreground/60" />
              <div className="text-sm font-medium">
                {searchTerm ? "No matching items found" : "No blanket & roller items yet"}
              </div>
              <div className="text-xs">
                {searchTerm 
                  ? "Try a different search term" 
                  : "Add your first blanket & roller item to get started"}
              </div>
            </div>
          </TableCell>
        </TableRow>
      );
    }

    return filteredItems.map((item) => (
      <BlanketRollerRow 
        key={item.id}
        blanketRoller={item}
        onEdit={() => handleEdit(item)}
        onDelete={() => handleDelete(item)}
      />
    ));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle>Blanket & Roller</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Blanket & Roller</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool Range</TableHead>
                <TableHead>Pool Model</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">RRP</TableHead>
                <TableHead className="text-right">Trade</TableHead>
                <TableHead className="text-right">Margin</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {renderContent()}
            </TableBody>
          </Table>
        </div>

        <AddBlanketRollerForm 
          open={isAddDialogOpen} 
          onOpenChange={handleFormClose}
          initialValues={editingItem}
          isEditMode={!!editingItem}
        />

        <DeleteConfirmDialog 
          blanketRoller={itemToDelete}
          onOpenChange={() => setItemToDelete(null)}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
        />
      </CardContent>
    </Card>
  );
};
