
import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import { HeatPumpTableHeader } from "./HeatPumpTableHeader";
import { HeatPumpTableRow } from "./HeatPumpTableRow";
import { EmptyState } from "./EmptyState";

interface HeatPumpTableProps {
  products: HeatPumpProduct[];
  searchTerm: string;
  onEdit: (product: HeatPumpProduct) => void;
  onDelete: (product: HeatPumpProduct) => void;
}

export const HeatPumpTable = ({ 
  products, 
  searchTerm, 
  onEdit, 
  onDelete 
}: HeatPumpTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <HeatPumpTableHeader />
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <HeatPumpTableRow 
                  key={product.id} 
                  product={product} 
                  onEdit={onEdit} 
                  onDelete={onDelete} 
                />
              ))
            ) : (
              <EmptyState searchTerm={searchTerm} />
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
