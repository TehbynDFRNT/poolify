
import * as React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { SidebarProvider } from "./ui/sidebar";
import MainNav from "./Navigation/MainNav";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <SidebarProvider open={!collapsed} onOpenChange={(open) => setCollapsed(!open)}>
          {/* Sidebar */}
          <div 
            className={cn(
              "h-screen bg-white border-r fixed left-0 top-0 transition-all duration-300 z-10",
              collapsed ? "w-20" : "w-64"
            )}
          >
            <div className="px-4 py-4 flex items-center justify-between">
              <Link to="/" className="flex items-center">
                {collapsed ? (
                  <img 
                    src="/lovable-uploads/24e1a72e-5067-4de7-82ee-530179df922c.png" 
                    alt="Poolify Logo" 
                    className="h-10 w-auto" 
                  />
                ) : (
                  <img 
                    src="/lovable-uploads/24e1a72e-5067-4de7-82ee-530179df922c.png" 
                    alt="Poolify Logo" 
                    className="h-14 w-auto"
                  />
                )}
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Use the MainNav component */}
            <div className="px-2 mt-2">
              <MainNav />
            </div>
          </div>

          {/* Main content */}
          <div 
            className={cn(
              "flex-1 transition-all duration-300",
              collapsed ? "ml-20" : "ml-64"
            )}
          >
            {children}
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};
