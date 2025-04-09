
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  isParent?: boolean;
  isSubItem?: boolean;
}

const NavItem = ({ 
  icon, 
  label, 
  to, 
  active, 
  isParent = false,
  isSubItem = false 
}: NavItemProps) => {
  const sidebar = useSidebar();
  const collapsed = sidebar?.state === "collapsed";

  return (
    <Link to={to} className="block">
      <div
        className={cn(
          "flex items-center py-3 rounded-lg transition-all duration-200",
          active
            ? "bg-primary text-white"
            : "hover:bg-gray-100 text-gray-600",
          isSubItem 
            ? "pl-10" // Add left padding for sub-items
            : "px-4", // Normal padding for parent items
          collapsed ? "justify-center" : "space-x-3"
        )}
      >
        <span className="flex items-center justify-center">
          {icon}
        </span>
        {!collapsed && (
          <span className={cn(
            "font-medium",
            active ? "text-white" : "text-gray-600"
          )}>
            {label}
          </span>
        )}
      </div>
    </Link>
  );
};

export default NavItem;
