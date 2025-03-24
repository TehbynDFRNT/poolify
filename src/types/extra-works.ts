
export interface ExtraWorks {
  pavingSelections: {
    categoryId: string;
    meters: number;
    cost: number;
  }[];
  concretingSelections: {
    typeId: string;
    quantity: number;
    cost: number;
  }[];
  retainingWallSelections: any[]; // To be implemented in the future
  waterFeatureSelections: any[]; // To be implemented in the future
  totalCost: number;
}
