
import { useState, useEffect } from "react";
import { useHeatingInstallations } from "@/hooks/useHeatingInstallations";
import { HeatingInstallation } from "@/types/heating-installation";
import { LoadingState } from "./components/LoadingState";
import { EmptyState } from "./components/EmptyState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { AddButton } from "./components/AddButton";
import { HeatingInstallationRow } from "./components/HeatingInstallationRow";
import { DeleteConfirmDialog } from "./components/DeleteConfirmDialog";
import { AddHeatingInstallationForm } from "./AddHeatingInstallationForm";
import { Thermometer } from "lucide-react";

export const HeatingInstallationsTable = () => {
  const { 
    heatingInstallations, 
    isLoading, 
    fetchHeatingInstallations, 
    addHeatingInstallation, 
    updateHeatingInstallation, 
    deleteHeatingInstallation 
  } = useHeatingInstallations();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingInstallation, setEditingInstallation] = useState<HeatingInstallation | null>(null);
  const [installationToDelete, setInstallationToDelete] = useState<HeatingInstallation | null>(null);

  useEffect(() => {
    fetchHeatingInstallations();
  }, []);

  const handleAddInstallation = async (installation: Omit<HeatingInstallation, "id" | "created_at">) => {
    await addHeatingInstallation(installation);
    setIsAddDialogOpen(false);
  };

  const handleEditInstallation = (installation: HeatingInstallation) => {
    setEditingInstallation(installation);
    setIsAddDialogOpen(true);
  };

  const handleUpdateInstallation = async (installation: Omit<HeatingInstallation, "id" | "created_at">) => {
    if (editingInstallation) {
      await updateHeatingInstallation(editingInstallation.id, installation);
      setEditingInstallation(null);
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (installationToDelete) {
      await deleteHeatingInstallation(installationToDelete.id);
      setInstallationToDelete(null);
    }
  };

  if (isLoading && heatingInstallations.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <CardTitle>Heating Installation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <LoadingState />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-primary" />
            <CardTitle>Heating Installation</CardTitle>
          </div>
          <AddButton 
            onClick={() => {
              setEditingInstallation(null);
              setIsAddDialogOpen(true);
            }} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Installation Type</TableHead>
                <TableHead className="w-[20%] text-right">Installation Cost</TableHead>
                <TableHead className="w-[40%]">Inclusions</TableHead>
                <TableHead className="w-[10%] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {heatingInstallations.length === 0 ? (
                <EmptyState />
              ) : (
                heatingInstallations.map((installation) => (
                  <HeatingInstallationRow
                    key={installation.id}
                    installation={installation}
                    onEdit={() => handleEditInstallation(installation)}
                    onDelete={() => setInstallationToDelete(installation)}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Installation Form Dialog */}
        <AddHeatingInstallationForm
          open={isAddDialogOpen}
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) setEditingInstallation(null);
          }}
          onSubmit={editingInstallation ? handleUpdateInstallation : handleAddInstallation}
          initialValues={editingInstallation}
          isEditMode={!!editingInstallation}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog 
          installation={installationToDelete}
          onOpenChange={() => setInstallationToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      </CardContent>
    </Card>
  );
};
