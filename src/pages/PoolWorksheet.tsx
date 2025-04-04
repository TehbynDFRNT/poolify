
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
import { columnGroups, defaultVisibleGroups } from "@/components/pool-worksheet/column-config";
import { useFixedCostsData } from "@/components/pool-worksheet/hooks/useFixedCostsData";
import { Button } from "@/components/ui/button";
import { List } from "lucide-react";

const LOCAL_STORAGE_KEY = "poolWorksheet_visibleGroups";
const ESSENTIAL_COLUMNS_KEY = "poolWorksheet_essentialOnly";

// Essential column groups that correspond to specific numbered columns (1,2,15,17,19,21,29,40,41)
// The actual columns map to these groups in the column-config.ts file
const essentialGroups = ["identification", "pricing", "crane", "excavation", "true_cost"];

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
              A comprehensive breakdown of all pool specifications
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={showEssentialOnly ? "default" : "outline"}
              size="sm"
              onClick={toggleEssentialColumnsOnly}
              className="flex items-center gap-2"
            >
              <List size={16} />
              {showEssentialOnly ? "Essential Columns Only" : "Show All Columns"}
            </Button>
            
            <ColumnConfigSheet 
              visibleGroups={visibleGroups} 
              setVisibleGroups={handleSetVisibleGroups} 
              showEssentialOnly={showEssentialOnly}
              toggleEssentialColumnsOnly={toggleEssentialColumnsOnly}
            />
          </div>
        </div>
        
        <PoolWorksheetTable 
          pools={pools}
          isLoading={isLoading}
          error={poolsError}
          visibleGroups={visibleGroups}
          setVisibleGroups={handleSetVisibleGroups}
          showEssentialOnly={showEssentialOnly}
        />
      </div>
    </DashboardLayout>
  );
};

export default PoolWorksheet;
