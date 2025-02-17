
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import type { PavingPrice } from "@/types/paving-price";

interface PavingPricesTableProps {
  prices: PavingPrice[];
}

export const PavingPricesTable = ({ prices }: PavingPricesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead className="text-right">Category 1</TableHead>
          <TableHead className="text-right">Category 2</TableHead>
          <TableHead className="text-right">Category 3</TableHead>
          <TableHead className="text-right">Category 4</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {prices.map((price) => (
          <TableRow key={price.id}>
            <TableCell className="font-medium">{price.name}</TableCell>
            <TableCell className="text-right">{formatCurrency(price.category_1_price)}</TableCell>
            <TableCell className="text-right">{formatCurrency(price.category_2_price)}</TableCell>
            <TableCell className="text-right">{formatCurrency(price.category_3_price)}</TableCell>
            <TableCell className="text-right">{formatCurrency(price.category_4_price)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
