
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { ChevronDown, ChevronRight } from "lucide-react";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  isParent?: boolean;
  isSubItem?: boolean;
  hasSubItems?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const NavItem = ({ 
  icon, 
  label, 
  to, 
  active, 
  isParent = false,
  isSubItem = false,
  hasSubItems = false,
  isExpanded = false,
  onToggle
}: NavItemProps) => {
  const sidebar = useSidebar();
  const collapsed = sidebar?.state === "collapsed";

  const handleClick = (e: React.MouseEvent) => {
    if (hasSubItems && onToggle) {
      e.preventDefault();
      onToggle();
    }
  };

  const content = (
    <div
      className={cn(
        "flex items-center py-3 rounded-lg transition-all duration-200",
        active
          ? "bg-primary text-white"
          : "hover:bg-gray-200 hover:text-gray-800",
        "px-4", // Same padding for all items
        collapsed ? "justify-center" : "space-x-3"
      )}
      onClick={handleClick}
    >
      <span className="flex items-center justify-center">
        {icon}
      </span>
      {!collapsed && (
        <>
          <span className={cn(
            "font-medium flex-1 text-gray-600",
            active && "text-white"
          )}>
            {label}
          </span>
          {hasSubItems && (
            <span className="flex items-center justify-center">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </span>
          )}
        </>
      )}
    </div>
  );

  if (hasSubItems) {
    return <div className="block cursor-pointer">{content}</div>;
  }

  return (
    <Link to={to} className="block">
      {content}
    </Link>
  );
};

export default NavItem;
