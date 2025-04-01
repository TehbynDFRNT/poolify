
import React from "react";
import { Link } from "react-router-dom";
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

export default NavItem;
