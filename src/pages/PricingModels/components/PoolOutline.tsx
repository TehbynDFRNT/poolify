
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const PoolOutline = () => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>Pool Outline</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-center">
        <img 
          src="/lovable-uploads/df5d055b-4d38-49ed-8a2f-b0625c3b09d5.png" 
          alt="Pool outline"
          className="max-w-[400px] w-full h-auto"
        />
      </div>
    </CardContent>
  </Card>
);
