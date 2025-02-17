
import React from "react";
import { Home, FileText, Users, Settings } from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon, label, active }: NavItemProps) => (
  <div
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
      active
        ? "bg-primary text-white"
        : "hover:bg-gray-100 text-gray-600"
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 h-screen bg-white border-r fixed left-0 top-0 p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-primary">Poolify</h1>
          </div>
          <nav className="space-y-2">
            <NavItem icon={<Home className="h-5 w-5" />} label="Dashboard" active />
            <NavItem icon={<FileText className="h-5 w-5" />} label="Proposals" />
            <NavItem icon={<Users className="h-5 w-5" />} label="Customers" />
            <NavItem icon={<Settings className="h-5 w-5" />} label="Settings" />
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-64 p-8">
          {children}
        </div>
      </div>
    </div>
  );
};
