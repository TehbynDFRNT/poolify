
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Construction,
  Database,
  Filter,
  Users,
  PlusCircle
} from "lucide-react";
import { Card } from "@/components/ui/card";

const Index = () => {
  const modules = [
    {
      title: "Pool Specifications",
      description: "Configure and manage pool specifications",
      icon: <Database className="w-6 h-6 text-primary" />,
      link: "/pool-specifications",
    },
    {
      title: "Construction Costs",
      description: "Manage construction and installation costs",
      icon: <Construction className="w-6 h-6 text-primary" />,
      link: "/construction-costs",
    },
    {
      title: "Third Party Costs",
      description: "Manage fencing, electrical and other contractor costs",
      icon: <Users className="w-6 h-6 text-primary" />,
      link: "/third-party-costs",
      className: "lg:col-span-1", // Ensure it takes up one column space
    },
    {
      title: "Filtration Systems",
      description: "Configure filtration systems and components",
      icon: <Filter className="w-6 h-6 text-primary" />,
      link: "/filtration-systems",
    },
    {
      title: "Add-Ons",
      description: "Manage pool add-ons and optional features",
      icon: <PlusCircle className="w-6 h-6 text-primary" />,
      link: "/add-ons",
    },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link 
              key={module.title} 
              to={module.link}
              className={`block ${module.className || ''}`}
            >
              <Card className="h-full p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  {module.icon}
                  <div>
                    <h2 className="text-lg font-semibold">{module.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
