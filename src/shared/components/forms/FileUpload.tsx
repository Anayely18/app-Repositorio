import { CheckCircle2, Upload } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

interface FileUploadProps {
  label: string;
  sublabel?: string;
  accept?: string;
  maxSize?: string;

  value?: File | null;               // ✅ nuevo
  onChange?: (file: File | null) => void;

  errorMessage?: string;
  error?: string;
}

export function FileUpload({
  label,
  sublabel,
  accept = ".pdf",
  maxSize = "10 MB",
  value = null,
  onChange,
  errorMessage,
  error,
}: FileUploadProps) {
  const err = error ?? errorMessage;
  const inputRef = useRef<HTMLInputElement | null>(null);

  // ✅ cuando el padre pone value = null, limpiamos el input file real
  useEffect(() => {
    if (!value && inputRef.current) inputRef.current.value = "";
  }, [value]);

  const inputId = useMemo(() => {
    // mejor que substring(0,20) (puede repetirse)
    return `file-${label.replace(/\s+/g, "-").toLowerCase()}-${Math.random().toString(16).slice(2)}`;
  }, [label]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onChange?.(selectedFile);
  };

  return (
    <div className="space-y-2">
      <label className="flex items-start gap-2 text-sm font-medium text-gray-700">
        <Upload className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <div className="flex flex-col">
          <span>{label}</span>
          {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
        </div>
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={inputId}
        />

        <label
          htmlFor={inputId}
          className={[
            "flex items-center justify-between w-full border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all group bg-gray-50 hover:bg-blue-50",
            err ? "border-red-300" : "border-gray-300 hover:border-blue-400",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {value ? value.name : "Click para subir archivo"}
              </p>
              <p className="text-xs text-gray-500">Máx. {maxSize}</p>
            </div>
          </div>

          {value && <CheckCircle2 className="w-5 h-5 text-green-500" />}
        </label>
      </div>

      {err && <p className="text-xs text-red-600 font-medium">{err}</p>}
    </div>
  );
}
