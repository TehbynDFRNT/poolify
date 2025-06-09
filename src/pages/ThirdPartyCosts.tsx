
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Users, Zap, Fence } from "lucide-react";
import { ThirdPartyCostsHeader } from "@/components/headers/ThirdPartyCostsHeader";

const ThirdPartyCosts = () => {
  const sections = [
    {
      title: "Electrical",
      description: "Manage electrical contractor costs and requirements",
      icon: <Zap className="h-6 w-6 text-gray-600" />,
      link: "/third-party-costs/electrical",
    },
    {
      title: "Fencing",
      description: "Configure fencing costs and specifications",
      icon: <Fence className="h-6 w-6 text-gray-600" />,
      link: "/third-party-costs/fencing",
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <ThirdPartyCostsHeader />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Link 
              key={section.title} 
              to={section.link}
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {section.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ThirdPartyCosts;
