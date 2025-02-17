
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Excavation from "./Excavation";

const ConstructionCosts = () => {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="excavation" className="space-y-6">
        <TabsList>
          <TabsTrigger value="excavation">Excavation</TabsTrigger>
          {/* Add more construction cost sections here */}
        </TabsList>
        
        <TabsContent value="excavation">
          <Excavation />
        </TabsContent>
        {/* Add more tab content sections here */}
      </TabsContent>
    </div>
  );
};

export default ConstructionCosts;
