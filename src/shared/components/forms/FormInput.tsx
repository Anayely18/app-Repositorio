import type { InputHTMLAttributes, KeyboardEvent } from "react";
import { LucideIcon } from "lucide-react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label: string;
  sublabel?: string;

  errorMessage?: string;
  error?: string;

  inputType?: "text" | "number" | "alphanumeric";
  hideSublabel?: boolean;

  // ✅ NUEVO: si es true, NO cambia borde/fondo por error
  noErrorStyle?: boolean;
}

const warnClass =
  "bg-amber-50 border-amber-300 ring-2 ring-amber-200 focus:ring-amber-300 focus:border-amber-400";

export function FormInput({
  icon: Icon,
  label,
  sublabel,
  errorMessage,
  error,
  hideSublabel = false,
  inputType = "alphanumeric",
  className,
  onKeyDown,
  ...props
}: FormInputProps) {
  const err = (error ?? errorMessage ?? "").trim();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // ... tu código de validación por tecla
    onKeyDown?.(e);
  };

  const baseClass =
    "w-full outline-none border-2 py-2.5 px-4 rounded-lg text-sm transition-all hover:border-gray-300 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="space-y-2">
      <label className="flex items-start gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 text-blue-600 mt-0.5" />}
        <div className="flex flex-col">
          <span>{label}</span>
          {sublabel && !hideSublabel && (
            <span className="text-xs font-normal text-gray-500">{sublabel}</span>
          )}
        </div>
      </label>

      <input
        {...props}
        aria-invalid={!!err}
        onKeyDown={handleKeyDown}
        className={[
          "w-full outline-none border-2 py-2.5 px-4 rounded-lg text-sm transition-all hover:border-gray-300",
          "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100",
          props.disabled ? "opacity-60 cursor-not-allowed" : "",
          className ?? "",
        ].join(" ")}
      />

      {err && <p className="text-xs text-red-600 font-medium">{err}</p>}
    </div>
  );
}
