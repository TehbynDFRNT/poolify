
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Truck } from "lucide-react";
import { useConcretePump } from "../hooks/useConcretePump";
import { formatCurrency } from "@/utils/format";

export const ConcretePump = () => {
  const { concretePump, isLoading, error, updateMutation, addMutation } = useConcretePump();
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(concretePump?.price || 1050);

  const handleSave = () => {
    if (concretePump) {
      updateMutation.mutate(
        { id: concretePump.id, price },
        { onSuccess: () => setIsEditing(false) }
      );
    } else {
      addMutation.mutate(
        { price },
        { onSuccess: () => setIsEditing(false) }
      );
    }
  };

  if (isLoading) {
    return <div>Loading concrete pump cost...</div>;
  }

  if (error) {
    return <div>Error loading concrete pump cost: {(error as Error).message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          <CardTitle>Concrete Pump</CardTitle>
        </div>
        <CardDescription>
          Configure the cost for concrete pump services
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium">Standard Concrete Pump</h3>
            {!isEditing && (
              <p className="text-2xl font-bold mt-2">{formatCurrency(concretePump?.price || price)}</p>
            )}
            {isEditing && (
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  className="w-36"
                />
                <Button onClick={handleSave}>Save</Button>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setPrice(concretePump?.price || 1050);
                }}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Price
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Standard concrete pump service cost for pool installations.
        </p>
      </CardContent>
    </Card>
  );
};
