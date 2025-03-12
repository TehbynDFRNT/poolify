
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Layers } from "lucide-react";
import { ExtraPavingCostsTable } from "./components/ExtraPavingCostsTable";

const ExtraPaving = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Extra Paving</h1>
            <p className="text-gray-500 mt-1">
              Manage additional paving costs for pool installations
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                <CardTitle>Extra Paving Costs</CardTitle>
              </div>
              <CardDescription>
                Configure and manage costs for additional paving requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExtraPavingCostsTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExtraPaving;
