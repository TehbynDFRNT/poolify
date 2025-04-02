
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  Home, 
  Database, 
  Construction, 
  Filter, 
  PlusCircle,
  Users,
  Wand2
} from "lucide-react";
import NavItem from "@/components/Navigation/NavItem";

const MainNav: React.FC = () => {
  const location = useLocation();
  
  const navigation = [
    { icon: <Home className="h-5 w-5" />, label: "Cost Builder", path: "/", isParent: true },
    { icon: <Database className="h-5 w-5" />, label: "Pool Specifications", path: "/pool-specifications", isParent: false },
    { icon: <Wand2 className="h-5 w-5" />, label: "Pool Creation Wizard", path: "/pool-creation-wizard", isParent: false },
    { icon: <Construction className="h-5 w-5" />, label: "Construction Costs", path: "/construction-costs", isParent: false },
    { icon: <Users className="h-5 w-5" />, label: "Third Party Costs", path: "/third-party-costs", isParent: false },
    { icon: <Filter className="h-5 w-5" />, label: "Filtration Systems", path: "/filtration-systems", isParent: false },
    { icon: <PlusCircle className="h-5 w-5" />, label: "Add-Ons", path: "/add-ons", isParent: false },
  ];

  return (
    <nav className="space-y-2">
      {navigation.map((item) => {
        // Only mark as active if it's an exact match for root path or starts with the item's path for other routes
        const isActive = item.path === "/" 
          ? location.pathname === "/" 
          : location.pathname.startsWith(item.path);
          
        return (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            to={item.path}
            active={isActive}
            isParent={item.isParent}
          />
        );
      })}
    </nav>
  );
};

export default MainNav;
