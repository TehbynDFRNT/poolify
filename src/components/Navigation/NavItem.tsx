
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
    <Link to={to}>
      <div
        className={cn(
          "flex items-center px-4 py-3 rounded-lg transition-all duration-200",
          active
            ? "bg-primary text-white"
            : "hover:bg-gray-100 text-gray-600",
          isParent && !active 
            ? "font-semibold" 
            : "",
          isSubItem 
            ? "pl-10 mt-1 text-sm" // Add left padding for sub-items
            : isParent ? "" : "pl-6", // Normal indent for non-parent items
          collapsed ? "justify-center" : "space-x-3"
        )}
      >
        {icon}
        {!collapsed && (
          <span className={cn(
            "font-medium", 
            isParent && !active && "text-lg",
            isSubItem && "text-sm"
          )}>
            {label}
          </span>
        )}
      </div>
    </Link>
  );
};

export default NavItem;
