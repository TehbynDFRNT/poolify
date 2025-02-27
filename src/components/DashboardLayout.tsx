
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Calculator, 
  Database, 
  Construction, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Users 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  collapsed?: boolean;
}

const NavItem = ({ icon, label, to, active, collapsed }: NavItemProps) => (
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
      {!collapsed && <span className="font-medium">{label}</span>}
    </div>
  </Link>
);

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigation = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", path: "/" },
    { icon: <Database className="h-5 w-5" />, label: "Pool Specifications", path: "/pool-specifications" },
    { icon: <Construction className="h-5 w-5" />, label: "Construction Costs", path: "/construction-costs" },
    { icon: <Users className="h-5 w-5" />, label: "Third Party Costs", path: "/third-party-costs" },
    { icon: <Filter className="h-5 w-5" />, label: "Filtration Systems", path: "/filtration-systems" },
    { icon: <Calculator className="h-5 w-5" />, label: "Price Builder", path: "/price-builder" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div 
          className={cn(
            "h-screen bg-white border-r fixed left-0 top-0 p-4 transition-all duration-300",
            collapsed ? "w-20" : "w-64"
          )}
        >
          <div className="mb-8 flex items-center justify-between">
            <Link to="/">
              {collapsed ? (
                <h1 className="text-2xl font-bold text-primary">P</h1>
              ) : (
                <h1 className="text-2xl font-bold text-primary">Poolify</h1>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <NavItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                to={item.path}
                active={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div 
          className={cn(
            "flex-1 transition-all duration-300",
            collapsed ? "ml-20" : "ml-64"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
