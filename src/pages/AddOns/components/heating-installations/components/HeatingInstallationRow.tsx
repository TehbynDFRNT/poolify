
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { HeatingInstallation } from "@/types/heating-installation";
import { formatCurrency } from "@/utils/format";

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
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Only show expand button if there are inclusions
  const hasInclusions = !!installation.installation_inclusions?.trim();

  return (
    <>
      <TableRow key={installation.id}>
        <TableCell>{installation.installation_type}</TableCell>
        <TableCell className="text-right">
          {formatCurrency(installation.installation_cost)}
        </TableCell>
        <TableCell>
          {hasInclusions ? (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              {isExpanded ? 'Hide details' : 'View details'}
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          ) : (
            <span className="text-muted-foreground">No inclusions specified</span>
          )}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive hover:text-destructive/90">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && hasInclusions && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={4} className="px-6 py-4">
            <div className="whitespace-pre-line text-sm">
              <strong>Inclusions:</strong>
              <p className="mt-1">{installation.installation_inclusions}</p>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
