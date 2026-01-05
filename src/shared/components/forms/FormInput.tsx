import { LucideIcon } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label: string;
  sublabel?: string;

  /** backward-compatible prop name */
  errorMessage?: string;
  /** new preferred prop name */
  error?: string;

  /** ✅ nuevo: marca visual de inválido (rojo), sin depender de error */
  invalid?: boolean;

  inputType?: "text" | "number" | "alphanumeric";
  hideSublabel?: boolean;
}

const warnClass =
  "bg-amber-50 border-amber-300 ring-2 ring-amber-200 focus:ring-amber-300 focus:border-amber-400";

const invalidClass =
  "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100";

export function FormInput({
  icon: Icon,
  label,
  sublabel,
  errorMessage,
  error,
  invalid = false,
  hideSublabel = false,
  inputType = "alphanumeric",
  className = "",
  ...props
}: FormInputProps) {
  const err = error ?? errorMessage;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (inputType === "text") {
      const allowedKeys = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
      const navigationKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];

      if (!navigationKeys.includes(e.key) && !allowedKeys.test(e.key)) {
        e.preventDefault();
      }
    } else if (inputType === "number") {
      const allowedKeys = /^[0-9]$/;
      const navigationKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "Enter",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ];

      if (!navigationKeys.includes(e.key) && !allowedKeys.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  // ✅ prioridad visual:
  // 1) si hay err => ámbar (tu diseño)
  // 2) si no hay err pero invalid => rojo
  // 3) si no hay nada => normal azul
  const stateClass = err
    ? warnClass
    : invalid
    ? invalidClass
    : "border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <div className="space-y-2">
      <label className="flex items-start gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 text-blue-600 mt-0.5" />}
        <div className="flex flex-col">
          <span>{label}</span>
          {!hideSublabel && sublabel && (
            <span className="text-xs font-normal text-gray-500">{sublabel}</span>
          )}
        </div>
      </label>

      <input
        {...props}
        onKeyDown={handleKeyDown}
        className={`w-full outline-none border-2 py-2.5 px-4 rounded-lg text-sm transition-all hover:border-gray-300 ${stateClass} ${className}`}
      />

      {err && <p className="text-xs text-amber-600 font-medium">{err}</p>}
    </div>
  );
}
