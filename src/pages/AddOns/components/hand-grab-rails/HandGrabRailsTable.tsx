
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Hand Grab Rails data
const handGrabRailsData = [
  {
    id: "1",
    model_number: "Black RTD-348BL",
    description: "Black Hand Grab Rail",
    cost_price: 793,
    margin: 357,
    total: 1150
  },
  {
    id: "2",
    model_number: "Taupe RTD 348T",
    description: "Taupe Hand Grab Rail",
    cost_price: 793,
    margin: 357,
    total: 1150
  },
  {
    id: "3",
    model_number: "White RTD-348W",
    description: "White Hand Grab Rail",
    cost_price: 793,
    margin: 357,
    total: 1150
  }
];

export const HandGrabRailsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredRails = handGrabRailsData.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      item.model_number.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search)
    );
  });

  const handleAddClick = () => {
    toast({
      title: "Add Hand Grab Rail",
      description: "This feature will be implemented soon.",
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <GripVertical className="h-5 w-5 text-primary" />
          <CardTitle>Hand Grab Rails</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {/* No duplicate title here */}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search hand rails..."
                  className="pl-8 w-[200px] md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="flex items-center gap-2" onClick={handleAddClick}>
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Hand Rail</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No hand grab rails found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRails.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.model_number}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">${item.cost_price.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${item.margin.toLocaleString()}</TableCell>
                      <TableCell className="text-right">${item.total.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
