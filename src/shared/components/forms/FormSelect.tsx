import type { LucideIcon } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  icon: LucideIcon;
  label: string;
  sublabel?: string;
  options: string[];
}

export function FormSelect({ icon: Icon, label, sublabel, options, ...props }: FormSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-800 flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-600" />
        <span>{label}</span>
      </label>
      {sublabel && <p className="text-xs text-gray-500 ml-6">{sublabel}</p>}

      <select
        className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
        {...props}
      >
        <option value="">Selecciona tu escuela profesional</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
