import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { GeneralExtra } from "@/types/general-extra";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { EditGeneralExtraForm } from "./EditGeneralExtraForm";

// Simple helper to format currency
const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

interface GeneralExtraRowProps {
    extra: GeneralExtra;
    onDelete: () => void;
}

export const GeneralExtraRow = ({
    extra,
    onDelete
}: GeneralExtraRowProps) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    return (
        <>
            <TableRow>
                <TableCell>{extra.name}</TableCell>
                <TableCell>{extra.sku}</TableCell>
                <TableCell>{extra.type}</TableCell>
                <TableCell>{extra.description || "-"}</TableCell>
                <TableCell className="text-right">{formatCurrency(extra.cost)}</TableCell>
                <TableCell className="text-right">{formatCurrency(extra.margin)}</TableCell>
                <TableCell className="text-right">{formatCurrency(extra.rrp)}</TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setIsEditDialogOpen(true)}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={onDelete}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
            <EditGeneralExtraForm
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                extra={extra}
            />
        </>
    );
}; 