
import { useState } from "react";
import { usePoolBlankets } from "@/hooks/usePoolBlankets";
import { AddPoolBlanketForm } from "./AddPoolBlanketForm";
import { PoolBlanketsActions } from "./PoolBlanketsActions";
import { PoolRangeSection } from "./PoolRangeSection";
import { PoolBlanket } from "@/types/pool-blanket";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const PoolBlanketsTable = () => {
  const { poolBlankets, isLoading, deletePoolBlanket, updatePoolBlanket } = usePoolBlankets();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBlanket, setEditingBlanket] = useState<PoolBlanket | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "blankets" | "heatpumps">("all");

  const handleDeleteBlanket = (id: string) => {
    if (window.confirm("Are you sure you want to delete this pool blanket?")) {
      deletePoolBlanket(id);
    }
  };

  const handleEditBlanket = (blanket: PoolBlanket) => {
    setEditingBlanket(blanket);
    setIsAddDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsAddDialogOpen(false);
    setEditingBlanket(null);
  };

  // Filter blankets based on search term
  const filteredPoolBlankets = poolBlankets?.filter(blanket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      blanket.pool_range.toLowerCase().includes(searchLower) ||
      blanket.pool_model.toLowerCase().includes(searchLower) ||
      blanket.blanket_sku.toLowerCase().includes(searchLower) ||
      blanket.blanket_description.toLowerCase().includes(searchLower) ||
      blanket.heatpump_sku.toLowerCase().includes(searchLower) ||
      blanket.heatpump_description.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-pulse">Loading pool blankets...</div>
        </CardContent>
      </Card>
    );
  }

  if (!poolBlankets?.length) {
    return (
      <div className="space-y-4">
        <PoolBlanketsActions onAddNew={() => setIsAddDialogOpen(true)} />
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No pool blankets found. Add your first one!</p>
          </CardContent>
        </Card>
        <AddPoolBlanketForm 
          open={isAddDialogOpen} 
          onOpenChange={handleCloseDialog} 
          editBlanket={editingBlanket}
        />
      </div>
    );
  }

  // Group blankets by range
  const blanketsByRange = filteredPoolBlankets?.reduce((acc, blanket) => {
    if (!acc[blanket.pool_range]) {
      acc[blanket.pool_range] = [];
    }
    acc[blanket.pool_range].push(blanket);
    return acc;
  }, {} as Record<string, PoolBlanket[]>) || {};

  return (
    <div className="space-y-4">
      <PoolBlanketsActions onAddNew={() => setIsAddDialogOpen(true)} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blankets or heat pumps..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "all" | "blankets" | "heatpumps")}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="blankets">Blankets</TabsTrigger>
            <TabsTrigger value="heatpumps">Heat Pumps</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-6">
        {Object.entries(blanketsByRange).length > 0 ? (
          Object.entries(blanketsByRange).map(([range, blanketsInRange]) => (
            <PoolRangeSection
              key={range}
              range={range}
              blankets={blanketsInRange}
              onEditBlanket={handleEditBlanket}
              onDeleteBlanket={handleDeleteBlanket}
              activeTab={activeTab}
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No matches found. Try adjusting your search.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <AddPoolBlanketForm 
        open={isAddDialogOpen} 
        onOpenChange={handleCloseDialog} 
        editBlanket={editingBlanket}
      />
    </div>
  );
};
