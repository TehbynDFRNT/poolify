
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PoolOutlineCardProps {
  poolName: string;
}

export const PoolOutlineCard = ({ poolName }: PoolOutlineCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Outline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full max-w-md mx-auto">
          <div className="relative w-full aspect-[4/3] border-2 border-gray-200 rounded-lg overflow-hidden">
            <img 
              src="/lovable-uploads/067e2299-40f3-4c0e-bf8a-3fb279d3c79b.png"
              alt={`${poolName} outline`}
              className="w-full h-full object-contain bg-white"
            />
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm" className="w-full" disabled>
              <ImagePlus className="h-4 w-4 mr-2" />
              Change Pool Image
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
