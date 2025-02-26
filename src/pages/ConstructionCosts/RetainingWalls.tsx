
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RetainingWallsTable } from "@/components/retaining-walls/RetainingWallsTable";
import { useState } from "react";
import { RetainingWall } from "@/types/retaining-wall";
import { toast } from "sonner";

const initialWalls: RetainingWall[] = [
  { id: "1", type: "Block Wall - Clad", rate: 400, extra_rate: 200, total: 600 },
  { id: "2", type: "Block Wall - Finished Block Work", rate: 500, extra_rate: 0, total: 500 },
  { id: "3", type: "Block Wall - Finished Block Work & Painted", rate: 400, extra_rate: 40, total: 440 },
  { id: "4", type: "Block Wall - Rendered", rate: 400, extra_rate: 100, total: 500 },
  { id: "5", type: "Block Wall - Rendered & Painted", rate: 400, extra_rate: 140, total: 540 },
  { id: "6", type: "Drop Edge - Clad", rate: 400, extra_rate: 200, total: 600 },
  { id: "7", type: "Drop Edge - Render", rate: 400, extra_rate: 100, total: 500 },
  { id: "8", type: "Drop Edge - Render & Painted", rate: 400, extra_rate: 140, total: 540 },
  { id: "9", type: "Drop Edge - Strip Finish", rate: 400, extra_rate: 0, total: 400 },
  { id: "10", type: "Drop Edge - Strip Finish & Painted", rate: 400, extra_rate: 40, total: 440 },
  { id: "11", type: "Timber", rate: 400, extra_rate: 0, total: 400 }
];

const RetainingWalls = () => {
  const [walls, setWalls] = useState<RetainingWall[]>(initialWalls);

  const handleUpdate = async (id: string, updates: Partial<RetainingWall>) => {
    try {
      setWalls(currentWalls => 
        currentWalls.map(wall => 
          wall.id === id ? { ...wall, ...updates } : wall
        )
      );
      toast.success("Retaining wall updated successfully");
    } catch (error) {
      console.error('Error updating retaining wall:', error);
      toast.error("Failed to update retaining wall");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs" className="transition-colors hover:text-foreground">
                Construction Costs
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs/retaining-walls" className="transition-colors hover:text-foreground">
                Retaining Walls
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Retaining Walls</h1>
            <p className="text-gray-500 mt-1">Manage retaining wall specifications and costs</p>
          </div>
          <Construction className="h-6 w-6 text-gray-500" />
        </div>

        <RetainingWallsTable walls={walls} onUpdate={handleUpdate} />
      </div>
    </DashboardLayout>
  );
};

export default RetainingWalls;
