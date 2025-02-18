
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Pencil, X } from "lucide-react";

interface EditableCellProps {
  value: string | number | null;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  type?: "text" | "number";
  align?: "left" | "right";
  format?: (value: any) => string;
  className?: string;
  inputClassName?: string;
  step?: string;
}

export function EditableCell({
  value,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
  onKeyDown,
  type = "text",
  align = "left",
  format = (v) => v?.toString() || '',
  className = "",
  inputClassName = "",
  step,
}: EditableCellProps) {
  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${align === 'right' ? 'justify-end' : ''}`}>
        <Input
          type={type}
          value={value === null ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          autoFocus
          className={`${type === 'number' ? 'w-32' : 'w-full'} ${inputClassName}`}
          step={step}
        />
        <Button size="sm" variant="ghost" onClick={onSave}><Check className="h-4 w-4" /></Button>
        <Button size="sm" variant="ghost" onClick={onCancel}><X className="h-4 w-4" /></Button>
      </div>
    );
  }

  return (
    <div
      className={`cursor-pointer hover:bg-muted px-2 py-1 rounded flex items-center ${
        align === 'right' ? 'justify-end' : 'justify-between'
      } gap-2 group ${className}`}
      onClick={onEdit}
    >
      {format(value)}
      <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100" />
    </div>
  );
}
