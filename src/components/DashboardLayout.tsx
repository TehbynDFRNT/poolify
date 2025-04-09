
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
            <div className="px-3 py-6 flex items-center justify-between">
              <Link to="/" className="flex items-center">
                {collapsed ? (
                  <img 
                    src="/lovable-uploads/31b051dc-41d2-4f2e-b30e-588c8369e522.png" 
                    alt="Poolify Logo" 
                    className="h-42 w-auto" 
                  />
                ) : (
                  <img 
                    src="/lovable-uploads/31b051dc-41d2-4f2e-b30e-588c8369e522.png" 
                    alt="Poolify Logo" 
                    className="h-60 w-auto max-w-[210px]"
                  />
                )}
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="ml-1"
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
            <div className="px-2 mt-4">
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
