import { TableCell, TableRow } from "@/components/ui/table";
import { Package } from "lucide-react";

export const EmptyGeneralExtrasState = () => {
    return (
        <TableRow>
            <TableCell colSpan={8} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Package className="h-10 w-10 mb-2" />
                    <p>No general extras found</p>
                    <p className="text-sm">Add a new extra item to get started</p>
                </div>
            </TableCell>
        </TableRow>
    );
}; 