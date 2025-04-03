
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { columnGroups } from "./column-config";

interface ColumnConfigSheetProps { 
  visibleGroups: string[]; 
  setVisibleGroups: (groups: string[]) => void;
}

export const ColumnConfigSheet = ({ 
  visibleGroups, 
  setVisibleGroups 
}: ColumnConfigSheetProps) => {
  const toggleColumnGroup = (groupId: string) => {
    if (visibleGroups.includes(groupId)) {
      setVisibleGroups(visibleGroups.filter(id => id !== groupId));
    } else {
      setVisibleGroups([...visibleGroups, groupId]);
    }
  };

  const toggleAllGroups = (show: boolean) => {
    if (show) {
      setVisibleGroups(columnGroups.map(group => group.id));
    } else {
      setVisibleGroups([]);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <Settings size={16} />
          Configure Columns
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configure Columns</SheetTitle>
          <SheetDescription>
            Toggle column groups to display in the table
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex justify-between py-2 mt-2">
          <Button 
            onClick={() => toggleAllGroups(true)} 
            variant="outline" 
            size="sm"
          >
            Show All
          </Button>
          <Button 
            onClick={() => toggleAllGroups(false)} 
            variant="outline" 
            size="sm"
          >
            Hide All
          </Button>
        </div>
        
        <ScrollArea className="h-[calc(100vh-200px)] mt-4 pr-4">
          {columnGroups.map((group) => (
            <div key={group.id} className="flex items-center justify-between py-2 border-b">
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
