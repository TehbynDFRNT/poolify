
import { useState } from "react";
import { usePoolWorksheets, useDeletePoolWorksheet } from "@/hooks/usePoolWorksheets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal, Eye, Trash, FileEdit } from "lucide-react";
import { Link } from "react-router-dom";

export function WorksheetsList() {
  const { data: worksheets, isLoading, error } = usePoolWorksheets();
  const deleteWorksheetMutation = useDeletePoolWorksheet();
  const [selectedWorksheet, setSelectedWorksheet] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (selectedWorksheet) {
      try {
        await deleteWorksheetMutation.mutateAsync(selectedWorksheet);
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error("Error deleting worksheet:", error);
      }
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading worksheets...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">Error loading worksheets</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!worksheets?.length) {
    return (
      <div className="text-center p-16 border border-dashed rounded-md bg-muted/10">
        <p className="text-xl text-muted-foreground mb-2">No worksheets found</p>
        <p className="text-muted-foreground mb-4">Create a new worksheet to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Worksheet Name</TableHead>
              <TableHead>Pool</TableHead>
              <TableHead>Pool Dimensions</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {worksheets.map((worksheet) => (
              <TableRow key={worksheet.id}>
                <TableCell className="font-medium">{worksheet.name}</TableCell>
                <TableCell>
                  {worksheet.pool ? (
                    <>
                      {worksheet.pool.name}
                      <div className="text-xs text-muted-foreground">
                        {worksheet.pool.range}
                      </div>
                    </>
                  ) : (
                    <span className="text-muted-foreground italic">Not specified</span>
                  )}
                </TableCell>
                <TableCell>
                  {worksheet.pool ? (
                    <>
                      {worksheet.pool.length}m x {worksheet.pool.width}m x {worksheet.pool.depth_shallow}-{worksheet.pool.depth_deep}m
                      <div className="text-xs text-muted-foreground">
                        {worksheet.pool.volume_liters ? `${Math.round(worksheet.pool.volume_liters / 1000)}kL` : 'Volume not specified'}
                      </div>
                    </>
                  ) : (
                    <span className="text-muted-foreground italic">No pool data</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(worksheet.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="flex items-center"
                        onClick={() => {
                          // View action - to be implemented
                          console.log("View worksheet:", worksheet.id);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center"
                        onClick={() => {
                          // Edit action - to be implemented
                          console.log("Edit worksheet:", worksheet.id);
                        }}
                      >
                        <FileEdit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center text-red-600"
                        onClick={() => {
                          setSelectedWorksheet(worksheet.id);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this worksheet?</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. This will permanently delete the worksheet and all its data.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteWorksheetMutation.isPending}
            >
              {deleteWorksheetMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
