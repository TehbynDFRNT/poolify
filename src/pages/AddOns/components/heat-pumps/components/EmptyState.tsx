
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Thermometer } from "lucide-react";

interface EmptyStateProps {
  searchTerm?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ searchTerm }) => {
  return (
    <Card>
      <CardContent className="p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="rounded-full bg-muted p-3">
            <Thermometer className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">
            {searchTerm ? "No heat pumps found" : "No heat pumps added yet"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {searchTerm 
              ? `No heat pumps match the search term "${searchTerm}". Try a different search.` 
              : "Get started by adding a new heat pump using the Add button above."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
