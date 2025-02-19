
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Calculator, Database, Construction, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem = ({ icon, label, to, active }: NavItemProps) => (
  <Link to={to}>
    <div
      className={cn(
        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
        active
          ? "bg-primary text-white"
          : "hover:bg-gray-100 text-gray-600"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  </Link>
);

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const navigation = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", path: "/" },
    { icon: <Database className="h-5 w-5" />, label: "Pool Specifications", path: "/pool-specifications" },
    { icon: <Construction className="h-5 w-5" />, label: "Construction Costs", path: "/construction-costs" },
    { icon: <Filter className="h-5 w-5" />, label: "Filtration Systems", path: "/filtration-systems" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 h-screen bg-white border-r fixed left-0 top-0 p-4">
          <div className="mb-8">
            <Link to="/">
              <h1 className="text-2xl font-bold text-primary">Poolify</h1>
            </Link>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                to={item.path}
                active={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)}
              />
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-64">
          {children}
        </div>
      </div>
    </div>
  );
};
