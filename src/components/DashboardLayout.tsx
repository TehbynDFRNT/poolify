
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { SidebarProvider } from "./ui/sidebar";
import MainNav from "./Navigation/MainNav";

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <SidebarProvider open={!collapsed} onOpenChange={(open) => setCollapsed(!open)}>
          {/* Sidebar */}
          <div 
            className={cn(
              "h-screen bg-white border-r fixed left-0 top-0 p-4 transition-all duration-300",
              collapsed ? "w-20" : "w-64"
            )}
          >
            <div className="mb-8 flex items-center justify-between">
              <Link to="/">
                {collapsed ? (
                  <h1 className="text-2xl font-bold text-primary">P</h1>
                ) : (
                  <h1 className="text-2xl font-bold text-primary">Poolify</h1>
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
            <MainNav />
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
