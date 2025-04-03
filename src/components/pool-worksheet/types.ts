
export interface ColumnGroup {
  id: string;
  title: string;
  color: string;
  columns: string[];
}

export type ColumnLabels = Record<string, string>;

export type VisibleGroups = string[];
