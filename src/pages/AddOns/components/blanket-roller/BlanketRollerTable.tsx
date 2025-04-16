
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
import { Layers, Plus, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useBlanketRollers } from "@/hooks/useBlanketRollers";
import { BlanketRoller } from "@/types/blanket-roller";
import { BlanketRollerRow } from "./BlanketRollerRow";
import { AddBlanketRollerForm } from "./AddBlanketRollerForm";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { EmptyState } from "./components/EmptyState";
import { LoadingState } from "./components/LoadingState";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export const BlanketRollerTable = () => {
  const { blanketRollers, isLoading, addBlanketRoller, deleteBlanketRoller, deleteAllBlanketRollers } = useBlanketRollers();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BlanketRoller | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BlanketRoller | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

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

  const confirmDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      await deleteAllBlanketRollers();
    } finally {
      setIsDeletingAll(false);
      setIsDeleteAllDialogOpen(false);
    }
  };

  const handleFormClose = () => {
    setIsAddDialogOpen(false);
    setEditingItem(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (filteredItems.length === 0) {
      return <EmptyState searchTerm={searchTerm} />;
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
            {blanketRollers.length > 0 && (
              <Button
                onClick={() => setIsDeleteAllDialogOpen(true)}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete All</span>
                <span className="sm:hidden">Delete All</span>
              </Button>
            )}
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

        <AlertDialog open={isDeleteAllDialogOpen} onOpenChange={setIsDeleteAllDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete All Blanket & Rollers</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete all blanket & roller products? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingAll}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  confirmDeleteAll();
                }}
                disabled={isDeletingAll}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeletingAll ? (
                  <>
                    <span className="loading loading-spinner mr-2"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete All"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};
