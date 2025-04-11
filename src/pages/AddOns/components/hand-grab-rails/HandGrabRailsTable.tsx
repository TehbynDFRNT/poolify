
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GrabRailsTable } from "./GrabRailsTable";
import { useHandGrabRails } from "./hooks/useHandGrabRails";

export const HandGrabRailsTable = () => {
  const { searchTerm, setSearchTerm, filteredHandGrabRails } = useHandGrabRails();
  const { toast } = useToast();

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

          <GrabRailsTable 
            items={filteredHandGrabRails}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
      </CardContent>
    </Card>
  );
};
