
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Construction, Plus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RetainingWallsTable } from "@/components/retaining-walls/RetainingWallsTable";
import { useState, useEffect } from "react";
import { RetainingWall } from "@/types/retaining-wall";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const RetainingWalls = () => {
  const [walls, setWalls] = useState<RetainingWall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newType, setNewType] = useState("");

  useEffect(() => {
    fetchWalls();
  }, []);

  const fetchWalls = async () => {
    try {
      const { data, error } = await supabase
        .from('retaining_walls')
        .select('*');

      if (error) throw error;
      setWalls(data);
    } catch (error) {
      console.error('Error fetching retaining walls:', error);
      toast.error("Failed to load retaining walls");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<RetainingWall>) => {
    try {
      const { error } = await supabase
        .from('retaining_walls')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

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

  const handleAdd = async () => {
    if (!newType.trim()) {
      toast.error("Please enter a wall type");
      return;
    }

    if (walls.some(wall => wall.type === newType.trim())) {
      toast.error("This wall type already exists");
      return;
    }

    try {
      const newWall = {
        type: newType.trim(),
        rate: 0,
        extra_rate: 0,
        total: 0
      };

      const { data, error } = await supabase
        .from('retaining_walls')
        .insert([newWall])
        .select()
        .single();

      if (error) throw error;

      setWalls(currentWalls => [...currentWalls, data]);
      setNewType(""); // Reset input
      toast.success("New wall type added");
    } catch (error) {
      console.error('Error adding wall type:', error);
      toast.error("Failed to add wall type");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Enter wall type"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-[200px]"
              />
              <Button onClick={handleAdd} size="sm" disabled={!newType.trim()}>
                <Plus className="h-4 w-4 mr-1" />
                Add Type
              </Button>
            </div>
            <Construction className="h-6 w-6 text-gray-500" />
          </div>
        </div>

        <RetainingWallsTable walls={walls} onUpdate={handleUpdate} />
      </div>
    </DashboardLayout>
  );
};

export default RetainingWalls;
