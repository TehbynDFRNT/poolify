
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { HeatingInstallation } from "@/types/heating-installation";

interface HeatingInstallationRowProps {
  installation: HeatingInstallation;
  onEdit: () => void;
  onDelete: () => void;
}

export const HeatingInstallationRow = ({
  installation,
  onEdit,
  onDelete,
}: HeatingInstallationRowProps) => {
  // Format currency with $ sign and 2 decimal places
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{installation.installation_type}</TableCell>
      <TableCell className="text-right">{formatCurrency(installation.installation_cost)}</TableCell>
      <TableCell>
        <div className="whitespace-pre-line">
          {installation.installation_inclusions}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
