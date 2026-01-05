import { CheckCircle2, Upload } from "lucide-react";
import { useId, useState } from "react";

interface FileUploadProps {
  label: string;
  sublabel?: string;
  accept?: string;
  maxSize?: string;
  onChange?: (file: File | null) => void;

  /** ✅ nuevo */
  invalid?: boolean;
  /** ✅ nuevo */
  error?: string;
  /** compat */
  errorMessage?: string;
}

export function FileUpload({
  label,
  sublabel,
  accept = ".pdf",
  maxSize = "1 MB",
  onChange,
  invalid = false,
  error,
  errorMessage,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const uid = useId();

  const err = error ?? errorMessage;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onChange?.(selectedFile);
  };

  const labelClass = `flex items-center justify-between w-full border-2 border-dashed rounded-lg p-4 cursor-pointer transition-all group bg-gray-50
    ${
      err || invalid
        ? "border-red-400 hover:border-red-500 hover:bg-red-50"
        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
    }`;

  const iconWrapClass = `p-2 rounded-lg transition-colors ${
    err || invalid
      ? "bg-red-100 group-hover:bg-red-200"
      : "bg-blue-100 group-hover:bg-blue-200"
  }`;

  const iconColorClass = err || invalid ? "text-red-600" : "text-blue-600";

  return (
    <div className="space-y-2">
      <label className="flex items-start gap-2 text-sm font-medium text-gray-700">
        <Upload className={`w-4 h-4 mt-0.5 shrink-0 ${iconColorClass}`} />
        <div className="flex flex-col">
          <span>{label}</span>
          {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
        </div>
      </label>

      <div className="relative">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={`file-${uid}`}
        />

        <label htmlFor={`file-${uid}`} className={labelClass}>
          <div className="flex items-center gap-3">
            <div className={iconWrapClass}>
              <Upload className={`w-5 h-5 ${iconColorClass}`} />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700">
                {file ? file.name : "Click para subir archivo"}
              </p>
              <p className="text-xs text-gray-500">Máx. {maxSize}</p>
            </div>
          </div>

          {file && <CheckCircle2 className="w-5 h-5 text-green-500" />}
        </label>
      </div>

      {(err || invalid) && err && (
        <p className="text-xs text-red-600 font-medium">{err}</p>
      )}
    </div>
  );
}

