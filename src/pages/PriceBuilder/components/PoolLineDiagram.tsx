
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PoolLineDiagramProps {
  pool: {
    name: string;
    length: number;
    width: number;
    depth_shallow: number;
    depth_deep: number;
  };
}

export const PoolLineDiagram = ({ pool }: PoolLineDiagramProps) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Pool Line Diagram</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-full max-w-2xl mx-auto">
            {/* Pool outline with gradient background */}
            <div className="relative aspect-[2/1] border-2 border-primary rounded-lg overflow-hidden">
              {/* Gradient for water effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/30" />
              
              {/* Depth lines */}
              <div className="absolute bottom-0 left-0 w-1/3 h-full">
                <div className="absolute bottom-0 w-full border-t-2 border-primary transform -skew-x-12" />
              </div>
              
              {/* Pool dimensions text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h3 className="text-2xl font-bold mb-2">{pool.name}</h3>
                <div className="space-y-1 text-sm">
                  <p>External {pool.length}m x {pool.width}m</p>
                  <p>Internal {(pool.length - 0.4).toFixed(1)}m x {(pool.width - 0.4).toFixed(1)}m</p>
                  <p>Depth {pool.depth_shallow}m to {pool.depth_deep}m</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
