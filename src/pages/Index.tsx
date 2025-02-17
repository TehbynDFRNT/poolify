
import { DashboardLayout } from "@/components/DashboardLayout";
import { FileUpload } from "@/components/FileUpload";
import { ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Poolify</h1>
          <p className="text-gray-600">
            Start by importing your data or creating a new proposal
          </p>
        </div>

        <div className="grid gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="mb-6">
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                Step 1
              </span>
              <h2 className="text-xl font-semibold mt-2 mb-1">Import Your Data</h2>
              <p className="text-gray-600 text-sm">
                Upload your existing spreadsheets to get started
              </p>
            </div>
            <FileUpload />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border opacity-50 cursor-not-allowed">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                  Step 2
                </span>
                <h2 className="text-xl font-semibold mt-2 mb-1">Create Your First Proposal</h2>
                <p className="text-gray-600 text-sm">
                  Start building professional pool proposals
                </p>
              </div>
              <ChevronRight className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
