
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
        <CardTitle className="text-lg font-semibold">Pool Outline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/590580b8-d08d-42ee-b7a5-d72d576b2263.png"
            alt={`${pool.name} Pool Line Diagram`}
            className="max-w-xl w-full h-auto"
          />
        </div>
      </CardContent>
    </Card>
  );
};
