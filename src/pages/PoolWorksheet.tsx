
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ColumnConfigSheet } from "@/components/pool-worksheet/ColumnConfigSheet";
import { PoolWorksheetTable } from "@/components/pool-worksheet/PoolWorksheetTable";
import { columnGroups, defaultVisibleGroups, essentialGroups } from "@/components/pool-worksheet/column-config";
import { useFixedCostsData } from "@/components/pool-worksheet/hooks/useFixedCostsData";
import { Button } from "@/components/ui/button";
import { List, Plus } from "lucide-react";
import { FormulaSection } from "@/components/pool-worksheet/FormulaSection";
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = "poolWorksheet_visibleGroups";
const ESSENTIAL_COLUMNS_KEY = "poolWorksheet_essentialOnly";

const PoolWorksheet = () => {
  const { data: pools, isLoading: isLoadingPools, error: poolsError } = usePoolSpecifications();
  const { fixedCosts, isLoadingFixedCosts } = useFixedCostsData();
  
  // Initialize visible groups from local storage or use default
  const [visibleGroups, setVisibleGroups] = useState<string[]>(() => {
    const savedGroups = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    // If we have saved groups, use them
    if (savedGroups) {
      try {
        const parsedGroups = JSON.parse(savedGroups);
        console.log("Loaded saved column config:", parsedGroups);
        
        // Ensure identification is always included
        if (Array.isArray(parsedGroups)) {
          return parsedGroups.includes('identification') 
            ? parsedGroups 
            : ['identification', ...parsedGroups];
        }
        
        return defaultVisibleGroups;
      } catch (e) {
        console.error("Error parsing saved column groups:", e);
        return defaultVisibleGroups;
      }
    }
    
    // Otherwise use defaults
    return defaultVisibleGroups;
  });
  
  // Track essential columns only mode
  const [showEssentialOnly, setShowEssentialOnly] = useState<boolean>(() => {
    const savedValue = localStorage.getItem(ESSENTIAL_COLUMNS_KEY);
    return savedValue === 'true';
  });

  // Save visible groups to local storage whenever they change
  useEffect(() => {
    // Ensure identification is always included
    const groupsToSave = visibleGroups.includes('identification') 
      ? visibleGroups 
      : ['identification', ...visibleGroups];
      
    console.log("Saving column config to localStorage:", groupsToSave);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(groupsToSave));
  }, [visibleGroups]);
  
  // Save essential only mode to local storage
  useEffect(() => {
    localStorage.setItem(ESSENTIAL_COLUMNS_KEY, showEssentialOnly.toString());
  }, [showEssentialOnly]);

  // Effect to update visible groups when essential mode changes
  useEffect(() => {
    if (showEssentialOnly) {
      setVisibleGroups(essentialGroups);
    }
  }, [showEssentialOnly]);

  // Ensure identification columns are always visible
  const handleSetVisibleGroups = (groups: string[]) => {
    const updatedGroups = groups.includes('identification')
      ? groups
      : ['identification', ...groups];
    setVisibleGroups(updatedGroups);
  };
  
  // Toggle essential columns only mode
  const toggleEssentialColumnsOnly = () => {
    setShowEssentialOnly(!showEssentialOnly);
    if (!showEssentialOnly) {
      // Show only essential groups
      handleSetVisibleGroups(essentialGroups);
    } else {
      // Show default groups when turning off essential mode
      handleSetVisibleGroups(defaultVisibleGroups);
    }
  };

  const isLoading = isLoadingPools || isLoadingFixedCosts;
  
  // Show a notification that the data has been reset
  useEffect(() => {
    toast.info("Pool worksheet data has been reset", {
      description: "The pool worksheet has been reset to a clean state."
    });
  }, []);

  const isDataEmpty = !pools || pools.length === 0;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              Pool Worksheet
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pool Worksheet</h1>
            <p className="text-muted-foreground mt-1">
              {isDataEmpty 
                ? "All pool worksheet data has been reset" 
                : "A comprehensive breakdown of all pool specifications"}
            </p>
          </div>
          
          <div className="flex gap-2">
            {!isDataEmpty && (
              <Button
                variant={showEssentialOnly ? "default" : "outline"}
                size="sm"
                onClick={toggleEssentialColumnsOnly}
                className="flex items-center gap-2"
              >
                <List size={16} />
                {showEssentialOnly ? "Essential Columns Only" : "Show All Columns"}
              </Button>
            )}
            
            {!isDataEmpty && (
              <ColumnConfigSheet 
                visibleGroups={visibleGroups} 
                setVisibleGroups={handleSetVisibleGroups} 
                showEssentialOnly={showEssentialOnly}
                toggleEssentialColumnsOnly={toggleEssentialColumnsOnly}
              />
            )}
          </div>
        </div>
        
        {isDataEmpty ? (
          <div className="border rounded-md p-12 bg-slate-50 text-center">
            <p className="text-lg mb-4">All pool worksheet data has been reset.</p>
            <p className="mb-6">You can add new pools from the Pool Specifications page.</p>
            <Link to="/pool-specifications">
              <Button className="bg-teal-500 hover:bg-teal-600">
                <Plus className="mr-2 h-4 w-4" />
                Go to Pool Specifications
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <PoolWorksheetTable 
              pools={pools}
              isLoading={isLoading}
              error={poolsError}
              visibleGroups={visibleGroups}
              setVisibleGroups={handleSetVisibleGroups}
              showEssentialOnly={showEssentialOnly}
            />
            <FormulaSection />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PoolWorksheet;
