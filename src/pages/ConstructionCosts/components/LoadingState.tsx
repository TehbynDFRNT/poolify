
import { DashboardLayout } from "@/components/DashboardLayout";

export const LoadingState = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-muted-foreground">Loading pool specifications...</div>
        </div>
      </div>
    </DashboardLayout>
  );
};
