
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PoolFiltration = () => {
  return (
    <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
      <CardHeader>
        <CardTitle>Pool Filtration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Filtration package details will be displayed here
        </div>
      </CardContent>
    </Card>
  );
};
