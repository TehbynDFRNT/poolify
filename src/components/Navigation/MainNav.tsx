
import React, { useState, useEffect } from "react";
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
  UserRound,
  FileText,
  ChevronDown,
  ChevronRight,
  Calculator,
  Percent
} from "lucide-react";
import NavItem from "@/components/Navigation/NavItem";

const EXPANDED_ITEMS_KEY = "poolify-nav-expanded-items";

const MainNav: React.FC = () => {
  const location = useLocation();
  
  // Initialize state from localStorage
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(EXPANDED_ITEMS_KEY);
      // If we have saved state, use it; otherwise default to Cost Builder expanded
      return saved ? JSON.parse(saved) : ["/"];
    } catch {
      // Default to Cost Builder expanded if there's an error
      return ["/"];
    }
  });
  
  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(EXPANDED_ITEMS_KEY, JSON.stringify(expandedItems));
    } catch (error) {
      console.error("Failed to save navigation state:", error);
    }
  }, [expandedItems]);
  
  // Define navigation with reordered menu
  const navigation = [
    { 
      icon: <UserRound className="h-5 w-5" />, 
      label: "Customers", 
      path: "/customers", 
      isParent: true,
      subItems: []
    },
    { 
      icon: <Waves className="h-5 w-5" />, 
      label: "Pool Builder", 
      path: "/pool-builder", 
      isParent: true,
      subItems: []
    },
    { 
      icon: <FileText className="h-5 w-5" />, 
      label: "Contract Builder", 
      path: "/contract-builder", 
      isParent: true,
      subItems: []
    },
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
        { 
          icon: <Calculator className="h-5 w-5" />, 
          label: "Formula References", 
          path: "/formula-references", 
          isParent: false 
        },
        { 
          icon: <Percent className="h-5 w-5" />, 
          label: "Discount Promotions", 
          path: "/discount-promotions", 
          isParent: false 
        },
      ]
    }
  ];

  const isActive = (item: any) => {
    if (item.path === "/" && location.pathname === "/") {
      return true;
    }
    return item.path !== "/" && location.pathname.startsWith(item.path);
  };

  const toggleExpanded = (itemPath: string) => {
    setExpandedItems(prev => 
      prev.includes(itemPath) 
        ? prev.filter(path => path !== itemPath)
        : [...prev, itemPath]
    );
  };

  const isExpanded = (itemPath: string) => expandedItems.includes(itemPath);

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <div key={item.path}>
          <NavItem
            icon={item.icon}
            label={item.label}
            to={item.path}
            active={isActive(item)}
            isParent={item.isParent}
            hasSubItems={item.subItems && item.subItems.length > 0}
            isExpanded={isExpanded(item.path)}
            onToggle={() => toggleExpanded(item.path)}
          />
          
          {/* Render sub-items only if expanded */}
          {isExpanded(item.path) && item.subItems?.map((subItem) => (
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
        </div>
      ))}
    </nav>
  );
};

export default MainNav;
