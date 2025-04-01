
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  Home, 
  Calculator, 
  Database, 
  Construction, 
  Filter, 
  PlusCircle,
  Users
} from "lucide-react";
import NavItem from "@/components/Navigation/NavItem";

const MainNav: React.FC = () => {
  const location = useLocation();
  
  const navigation = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", path: "/" },
    { icon: <Database className="h-5 w-5" />, label: "Pool Specifications", path: "/pool-specifications" },
    { icon: <Construction className="h-5 w-5" />, label: "Construction Costs", path: "/construction-costs" },
    { icon: <Users className="h-5 w-5" />, label: "Third Party Costs", path: "/third-party-costs" },
    { icon: <Filter className="h-5 w-5" />, label: "Filtration Systems", path: "/filtration-systems" },
    { icon: <PlusCircle className="h-5 w-5" />, label: "Add-Ons", path: "/add-ons" },
    { icon: <Calculator className="h-5 w-5" />, label: "Price Builder", path: "/price-builder" },
  ];

  return (
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
  );
};

export default MainNav;
