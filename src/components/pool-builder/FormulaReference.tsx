
import React from "react";
import { Calculator } from "lucide-react";
import {
  Accordion,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExtraPavingConcreteFormula } from "./formula-sections/ExtraPavingConcreteFormula";
import { ExtraPavingExistingConcreteFormula } from "./formula-sections/ExtraPavingExistingConcreteFormula";
import { ExtraConcretingFormula } from "./formula-sections/ExtraConcretingFormula";
import { UnderFenceConcreteStripsFormula } from "./formula-sections/UnderFenceConcreteStripsFormula";
import { ConcreteCutsFormula } from "./formula-sections/ConcreteCutsFormula";
import { ConcretePumpFormula } from "./formula-sections/ConcretePumpFormula";
import { RetainingWallFormula } from "./formula-sections/RetainingWallFormula";

export const FormulaReference: React.FC = () => {
  return (
    <Card>
      <CardHeader className="bg-white pb-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Formulas</CardTitle>
        </div>
        <CardDescription>
          Per meter rates by paving category
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <Accordion type="single" collapsible className="w-full">
          <ExtraPavingConcreteFormula />
          <ExtraPavingExistingConcreteFormula />
          <ExtraConcretingFormula />
          <UnderFenceConcreteStripsFormula />
          <ConcreteCutsFormula />
          <ConcretePumpFormula />
          <RetainingWallFormula />
        </Accordion>
      </CardContent>
    </Card>
  );
};
