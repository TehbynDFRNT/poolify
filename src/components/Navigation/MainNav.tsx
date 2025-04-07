
import React from "react";
import { useLocation } from "react-router-dom";
import { 
  Home, 
  Database, 
  Construction, 
  Filter, 
  PlusCircle,
  Users,
  Wand2,
  ClipboardList,
  Waves,
  UserRound
} from "lucide-react";
import NavItem from "@/components/Navigation/NavItem";

const MainNav: React.FC = () => {
  const location = useLocation();
  
  // Define navigation with Cost Builder and Pool Builder as parents
  const navigation = [
    { 
      icon: <Home className="h-5 w-5" />, 
      label: "Cost Builder", 
      path: "/", 
      isParent: true,
      subItems: [
        { 
          icon: <Wand2 className="h-5 w-5" />, 
          label: "Pool Creation Wizard", 
          path: "/pool-creation-wizard", 
          isParent: false 
        },
        { 
          icon: <Database className="h-5 w-5" />, 
          label: "Pool Specifications", 
          path: "/pool-specifications", 
          isParent: false 
        },
        { 
          icon: <Construction className="h-5 w-5" />, 
          label: "Construction Costs", 
          path: "/construction-costs", 
          isParent: false 
        },
        { 
          icon: <Users className="h-5 w-5" />, 
          label: "Third Party Costs", 
          path: "/third-party-costs", 
          isParent: false 
        },
        { 
          icon: <Filter className="h-5 w-5" />, 
          label: "Filtration Systems", 
          path: "/filtration-systems", 
          isParent: false 
        },
        { 
          icon: <PlusCircle className="h-5 w-5" />, 
          label: "Add-Ons", 
          path: "/add-ons", 
          isParent: false 
        },
        { 
          icon: <ClipboardList className="h-5 w-5" />, 
          label: "Pool Worksheet", 
          path: "/pool-worksheet", 
          isParent: false 
        },
      ]
    },
    { 
      icon: <Waves className="h-5 w-5" />, 
      label: "Pool Builder", 
      path: "/pool-builder", 
      isParent: true,
      subItems: []
    },
    { 
      icon: <UserRound className="h-5 w-5" />, 
      label: "Customers", 
      path: "/customers", 
      isParent: true,
      subItems: []
    }
  ];

  const isActive = (item: any) => {
    if (item.path === "/" && location.pathname === "/") {
      return true;
    }
    return item.path !== "/" && location.pathname.startsWith(item.path);
  };

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <React.Fragment key={item.path}>
          <NavItem
            icon={item.icon}
            label={item.label}
            to={item.path}
            active={isActive(item)}
            isParent={item.isParent}
          />
          
          {/* Render sub-items */}
          {item.subItems?.map((subItem) => (
            <NavItem
              key={subItem.path}
              icon={subItem.icon}
              label={subItem.label}
              to={subItem.path}
              active={isActive(subItem)}
              isParent={false}
              isSubItem={true}
            />
          ))}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default MainNav;
