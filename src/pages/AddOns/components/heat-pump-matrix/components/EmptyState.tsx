
import { TableRow, TableCell } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateMissingMatches?: () => void;
  hasPoolData: boolean;
  hasHeatPumpData: boolean;
}

export const EmptyState = ({ onCreateMissingMatches, hasPoolData, hasHeatPumpData }: EmptyStateProps) => {
  const renderMessage = () => {
    if (!hasPoolData && !hasHeatPumpData) {
      return (
        <>
          <p className="text-muted-foreground mb-2">No pools or heat pumps found</p>
          <p className="text-sm text-muted-foreground">
            You need to add both pools and heat pumps before creating assignments
          </p>
        </>
      );
    } else if (!hasPoolData) {
      return (
        <>
          <p className="text-muted-foreground mb-2">No pools found</p>
          <p className="text-sm text-muted-foreground">
            You need to add pools before creating heat pump assignments
          </p>
        </>
      );
    } else if (!hasHeatPumpData) {
      return (
        <>
          <p className="text-muted-foreground mb-2">No heat pumps found</p>
          <p className="text-sm text-muted-foreground">
            You need to add heat pumps before creating assignments
          </p>
        </>
      );
    } else {
      return (
        <>
          <p className="text-muted-foreground mb-2">No heat pump assignments found</p>
          <p className="text-sm text-muted-foreground mb-4">
            Click the button below to create heat pump assignments for all pools
          </p>
          {onCreateMissingMatches && (
            <Button onClick={onCreateMissingMatches}>
              Create Heat Pump Assignments
            </Button>
          )}
        </>
      );
    }
  };

  return (
    <TableRow>
      <TableCell colSpan={9} className="h-24 text-center">
        <div className="flex flex-col items-center justify-center py-6">
          <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
          {renderMessage()}
        </div>
      </TableCell>
    </TableRow>
  );
};
