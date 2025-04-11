
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import { Plus } from "lucide-react";

export const BlanketRollerTable = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle>Blanket & Roller</CardTitle>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Blanket & Roller
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Model</TableHead>
                <TableHead className="w-[20%] text-right">Price</TableHead>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead className="w-[10%] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <td colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-1 py-4 text-muted-foreground">
                    <Layers className="h-10 w-10 text-muted-foreground/60" />
                    <div className="text-sm font-medium">No blanket & roller items yet</div>
                    <div className="text-xs">Add your first blanket & roller item to get started</div>
                  </div>
                </td>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
