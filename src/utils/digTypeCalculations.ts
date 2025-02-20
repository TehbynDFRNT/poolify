
import type { DigType } from "@/types/dig-type";

export const calculateTruckSubTotal = (
  type: DigType,
  editingRow?: Partial<DigType>
) => {
  const quantity = editingRow?.truck_quantity ?? type.truck_quantity;
  const rate = editingRow?.truck_hourly_rate ?? type.truck_hourly_rate;
  const hours = editingRow?.truck_hours ?? type.truck_hours;
  return quantity * rate * hours;
};

export const calculateExcavationSubTotal = (
  type: DigType,
  editingRow?: Partial<DigType>
) => {
  const rate = editingRow?.excavation_hourly_rate ?? type.excavation_hourly_rate;
  const hours = editingRow?.excavation_hours ?? type.excavation_hours;
  return rate * hours;
};

export const calculateGrandTotal = (
  type: DigType,
  editingRow?: Partial<DigType>
) => {
  return calculateTruckSubTotal(type, editingRow) + calculateExcavationSubTotal(type, editingRow);
};
