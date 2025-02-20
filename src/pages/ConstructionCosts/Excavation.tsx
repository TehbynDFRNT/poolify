
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Excavation = () => {
  return (
    <div className="container mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Excavation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚧</div>
            <h2 className="text-xl font-semibold mb-2">Under Construction</h2>
            <p className="text-gray-600">
              The excavation functionality is currently being developed. 
              Check back soon for updates.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Excavation;
