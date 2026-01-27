import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { LucideIcon } from "lucide-react";

interface FormSelectProps {
  icon: LucideIcon;
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;

  errorMessage?: string;
  error?: string;
}

const warnSelect =
  "border-amber-300 ring-2 ring-amber-200 focus:ring-amber-300 focus:border-amber-400";

export function FormSelect({
  icon: Icon,
  label,
  options,
  value,
  onChange,
  errorMessage,
  error,
}: FormSelectProps) {
  const err = error ?? errorMessage;

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-600" />
        {label}
      </label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`w-full ${err ? warnSelect : ""}`}>
          <SelectValue placeholder={`Seleccione ${label.toLowerCase()}`} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {err && <p className="text-xs text-amber-600 font-medium">{err}</p>}
    </div>
  );
}
