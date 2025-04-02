
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
          isParent && !active 
            ? "font-semibold" 
            : "",
          isSubItem 
            ? "pl-12 mt-1 text-sm" // Increased left padding for sub-items
            : "px-4", // Consistent padding for all main items
          collapsed ? "justify-center" : "space-x-3"
        )}
      >
        <span className={cn(
          "flex items-center justify-center",
          isSubItem && !collapsed ? "ml-1" : ""
        )}>
          {icon}
        </span>
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
