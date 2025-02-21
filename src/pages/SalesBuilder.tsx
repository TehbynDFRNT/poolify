
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Briefcase, FileText, FileSpreadsheet, PenLine } from "lucide-react";

const SalesBuilder = () => {
  const features = [
    {
      title: "Quote Generation",
      description: "Create professional quotes for customers",
      icon: <FileText className="w-6 h-6 text-primary" />,
    },
    {
      title: "Proposal Templates",
      description: "Customize and manage proposal templates",
      icon: <FileSpreadsheet className="w-6 h-6 text-primary" />,
    },
    {
      title: "Contract Management",
      description: "Handle contracts and agreements",
      icon: <PenLine className="w-6 h-6 text-primary" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-3 mb-8">
          <Briefcase className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Sales Builder</h1>
        </div>
        
        <div className="mb-8">
          <p className="text-muted-foreground">
            Create and manage sales documents, quotes, and proposals for your pool projects.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <div className="flex items-center gap-4">
                {feature.icon}
                <div>
                  <h2 className="text-lg font-semibold">{feature.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center text-muted-foreground">
          <p>More features coming soon...</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesBuilder;
