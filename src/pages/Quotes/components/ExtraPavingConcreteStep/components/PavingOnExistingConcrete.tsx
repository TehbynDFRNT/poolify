
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SquareDashed } from "lucide-react";

export const PavingOnExistingConcrete = () => {
  return (
    <Card className="border border-gray-200 mt-6">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <SquareDashed className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Paving on Existing Concrete</h3>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-md border border-dashed border-gray-300">
          <p className="text-gray-500">Placeholder for Paving on Existing Concrete options</p>
        </div>
      </CardContent>
    </Card>
  );
};
