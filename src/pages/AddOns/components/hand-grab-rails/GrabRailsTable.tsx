
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { HandGrabRailItem } from "./hooks/useHandGrabRails";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GrabRailsTableProps {
  items: HandGrabRailItem[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  onEdit?: (item: HandGrabRailItem) => void;
  onDelete?: (id: string) => void;
}

export const GrabRailsTable = ({ 
  items, 
  searchTerm, 
  onSearchChange, 
  isLoading = false,
  onEdit,
  onDelete
}: GrabRailsTableProps) => {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleEdit = (item: HandGrabRailItem) => {
    if (onEdit) {
      onEdit(item);
    } else {
      toast({
        title: "Edit functionality",
        description: "Edit functionality will be implemented soon.",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (onDelete) {
      setDeleting(id);
      try {
        await onDelete(id);
      } finally {
        setDeleting(null);
      }
    } else {
      toast({
        title: "Delete functionality",
        description: "Delete functionality will be implemented soon.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Loading hand grab rails...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Model</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Margin</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                {searchTerm ? "No hand grab rails found matching your search." : "No hand grab rails found."}
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.model_number}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">${item.cost_price.toLocaleString()}</TableCell>
                <TableCell className="text-right">${item.margin.toLocaleString()}</TableCell>
                <TableCell className="text-right">${item.total.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                    >
                      {deleting === item.id ? (
                        <div className="h-4 w-4 border-2 border-destructive border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
