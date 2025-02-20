
import { DashboardLayout } from "@/components/DashboardLayout";

export const ErrorState = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-destructive">
            Error loading pool specifications. Please try again later.
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
