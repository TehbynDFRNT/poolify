
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { columnGroups } from "./PoolSpecificationsTable";

interface ColumnConfigSheetProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  visibleGroups: string[];
  setVisibleGroups: (groups: string[]) => void;
}

export function ColumnConfigSheet({ 
  isOpen, 
  setIsOpen, 
  visibleGroups, 
  setVisibleGroups 
}: ColumnConfigSheetProps) {
  // Toggle individual column group visibility
  const toggleColumnGroup = (groupId: string) => {
    if (visibleGroups.includes(groupId)) {
      setVisibleGroups(visibleGroups.filter(id => id !== groupId));
    } else {
      setVisibleGroups([...visibleGroups, groupId]);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configure Columns
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Column Visibility</SheetTitle>
          <SheetDescription>
            Toggle which column groups are visible in the table
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {columnGroups.map((group) => (
            <div key={group.id} className="flex items-center justify-between py-2">
              <div>
                <h4 className="font-medium">{group.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {group.columns.length} columns
                </p>
              </div>
              <Button
                onClick={() => toggleColumnGroup(group.id)}
                variant={visibleGroups.includes(group.id) ? "default" : "outline"}
                size="sm"
              >
                {visibleGroups.includes(group.id) ? "Hide" : "Show"}
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <SheetClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button size="sm">
              Apply
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
