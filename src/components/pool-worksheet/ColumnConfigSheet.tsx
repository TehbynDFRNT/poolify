import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { columnGroups } from "./column-config";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ColumnConfigSheetProps { 
  visibleGroups: string[]; 
  setVisibleGroups: (groups: string[]) => void;
}

export const ColumnConfigSheet = ({ 
  visibleGroups, 
  setVisibleGroups 
}: ColumnConfigSheetProps) => {
  // Keep a temporary copy of the visible groups for editing
  const [tempVisibleGroups, setTempVisibleGroups] = useState<string[]>(visibleGroups);
  const [isOpen, setIsOpen] = useState(false);

  // Update temp groups when the actual visible groups change
  useEffect(() => {
    if (isOpen) {
      setTempVisibleGroups(visibleGroups);
    }
  }, [visibleGroups, isOpen]);

  // Toggle individual column groups in the temp state
  const toggleColumnGroup = (groupId: string) => {
    if (tempVisibleGroups.includes(groupId)) {
      setTempVisibleGroups(tempVisibleGroups.filter(id => id !== groupId));
    } else {
      setTempVisibleGroups([...tempVisibleGroups, groupId]);
    }
  };

  // Toggle all groups in the temp state
  const toggleAllGroups = (show: boolean) => {
    if (show) {
      setTempVisibleGroups(columnGroups.map(group => group.id));
    } else {
      // When hiding all, still keep identification group
      setTempVisibleGroups(['identification']);
    }
  };
  
  // Show only the selected group plus identification
  const showOnlyGroup = (groupId: string) => {
    // Always include identification columns
    const newGroups = groupId === 'identification' ? ['identification'] : ['identification', groupId];
    setTempVisibleGroups(newGroups);
  };

  // Save the changes back to the parent component
  const saveChanges = () => {
    // Ensure identification group is always included
    const newGroups = tempVisibleGroups.includes('identification') 
      ? tempVisibleGroups 
      : ['identification', ...tempVisibleGroups];
      
    setVisibleGroups(newGroups);
    toast.success("Column configuration saved!");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
        
        <ScrollArea className="h-[calc(100vh-300px)] mt-4 pr-4">
          {columnGroups.map((group) => (
            <div key={group.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <h4 className="font-medium">{group.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {group.columns.length} columns
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => showOnlyGroup(group.id)}
                  variant="secondary"
                  size="sm"
                  title="Show only this group (plus identification)"
                  className="text-xs px-2"
                >
                  Only
                </Button>
                <Button
                  onClick={() => toggleColumnGroup(group.id)}
                  variant={tempVisibleGroups.includes(group.id) ? "default" : "outline"}
                  size="sm"
                  disabled={group.id === 'identification'} // Prevent toggling identification group
                  title={group.id === 'identification' ? "Pool identification columns are always visible" : undefined}
                >
                  {tempVisibleGroups.includes(group.id) ? "Hide" : "Show"}
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-6">
          <SheetClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </SheetClose>
          <Button onClick={saveChanges} size="sm">
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
