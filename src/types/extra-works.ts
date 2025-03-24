
export interface ExtraWorks {
  pavingSelections: {
    categoryId: string;
    meters: number;
    cost: number;
  }[];
  concretingSelections: any[]; // To be implemented in the future
  retainingWallSelections: any[]; // To be implemented in the future
  waterFeatureSelections: any[]; // To be implemented in the future
  totalCost: number;
}
