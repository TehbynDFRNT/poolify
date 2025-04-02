
import { useState } from "react";
import { usePoolWorksheet } from "@/hooks/usePoolWorksheets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash } from "lucide-react";
import { AddWorksheetItemDialog } from "./AddWorksheetItemDialog";
import { formatCurrency } from "@/utils/format";

export function WorksheetView() {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const { data: worksheet, isLoading } = usePoolWorksheet();

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading worksheet data...</div>;
  }

  if (!worksheet?.items?.length) {
    return (
      <div className="text-center p-16 border border-dashed rounded-md bg-muted/10">
        <p className="text-xl text-muted-foreground mb-2">No worksheet items</p>
        <p className="text-muted-foreground mb-4">Add items to your worksheet to get started</p>
        <Button 
          onClick={() => setIsAddingItem(true)} 
          className="bg-teal-500 hover:bg-teal-600"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add First Item
        </Button>
        <AddWorksheetItemDialog 
          open={isAddingItem} 
          onOpenChange={setIsAddingItem} 
        />
      </div>
    );
  }

  const totalCost = worksheet.items.reduce((sum, item) => sum + item.total_cost, 0);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">{worksheet.name}</h3>
          {worksheet.pool && (
            <p className="text-muted-foreground">{worksheet.pool.name} ({worksheet.pool.range})</p>
          )}
        </div>
        <Button 
          onClick={() => setIsAddingItem(true)} 
          className="bg-teal-500 hover:bg-teal-600"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Unit Cost</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {worksheet.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  {item.item_name}
                  {item.notes && (
                    <p className="text-xs text-muted-foreground mt-1">{item.notes}</p>
                  )}
                </TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.unit_cost)}</TableCell>
                <TableCell className="text-right">{formatCurrency(item.total_cost)}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex justify-end">
        <div className="bg-muted p-4 rounded-md">
          <div className="flex justify-between text-lg font-medium">
            <span>Total Cost:</span>
            <span className="ml-8">{formatCurrency(totalCost)}</span>
          </div>
        </div>
      </div>

      <AddWorksheetItemDialog 
        open={isAddingItem} 
        onOpenChange={setIsAddingItem} 
      />
    </>
  );
}
