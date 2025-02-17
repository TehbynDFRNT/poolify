
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { PavingPrice } from "@/types/paving-price";

interface PavingPricesTableProps {
  prices: PavingPrice[];
}

export const PavingPricesTable = ({ prices: initialPrices }: PavingPricesTableProps) => {
  const [prices, setPrices] = useState(initialPrices);
  const [editingCell, setEditingCell] = useState<{
    id: string;
    category: 1 | 2 | 3 | 4;
  } | null>(null);

  useEffect(() => {
    setPrices(initialPrices);
  }, [initialPrices]);

  const calculateTotal = (categoryIndex: 1 | 2 | 3 | 4) => {
    const key = `category_${categoryIndex}_price` as keyof PavingPrice;
    return prices.reduce((sum, price) => {
      const value = price[key];
      return typeof value === 'number' ? sum + value : sum;
    }, 0);
  };

  const handleCellClick = (id: string, category: 1 | 2 | 3 | 4) => {
    setEditingCell({ id, category });
  };

  const handlePriceChange = async (id: string, category: 1 | 2 | 3 | 4, value: string) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return;

    const key = `category_${category}_price`;
    
    // Update local state
    setPrices(currentPrices =>
      currentPrices.map(price =>
        price.id === id
          ? { ...price, [key]: numericValue }
          : price
      )
    );

    // Update database
    const { error } = await supabase
      .from('paving_prices')
      .update({ [key]: numericValue })
      .eq('id', id);

    if (error) {
      console.error('Error updating price:', error);
    }

    setEditingCell(null);
  };

  const renderCell = (price: PavingPrice, category: 1 | 2 | 3 | 4) => {
    const key = `category_${category}_price` as keyof PavingPrice;
    const value = price[key];
    const isEditing = editingCell?.id === price.id && editingCell?.category === category;

    if (isEditing) {
      return (
        <Input
          type="number"
          defaultValue={value?.toString()}
          className="w-24"
          autoFocus
          onBlur={(e) => handlePriceChange(price.id, category, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handlePriceChange(price.id, category, (e.target as HTMLInputElement).value);
            }
          }}
        />
      );
    }

    return (
      <div
        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
        onClick={() => handleCellClick(price.id, category)}
      >
        {formatCurrency(typeof value === 'number' ? value : 0)}
      </div>
    );
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
            <TableCell className="text-right">{renderCell(price, 1)}</TableCell>
            <TableCell className="text-right">{renderCell(price, 2)}</TableCell>
            <TableCell className="text-right">{renderCell(price, 3)}</TableCell>
            <TableCell className="text-right">{renderCell(price, 4)}</TableCell>
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
