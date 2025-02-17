
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
  const calculateTotal = (categoryIndex: 1 | 2 | 3 | 4) => {
    const key = `category_${categoryIndex}_price` as keyof PavingPrice;
    return prices.reduce((sum, price) => {
      const value = price[key];
      return typeof value === 'number' ? sum + value : sum;
    }, 0);
  };

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
        <TableRow className="border-t-2">
          <TableCell className="font-bold">Total</TableCell>
          <TableCell className="text-right font-bold">{formatCurrency(calculateTotal(1))}</TableCell>
          <TableCell className="text-right font-bold">{formatCurrency(calculateTotal(2))}</TableCell>
          <TableCell className="text-right font-bold">{formatCurrency(calculateTotal(3))}</TableCell>
          <TableCell className="text-right font-bold">{formatCurrency(calculateTotal(4))}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
