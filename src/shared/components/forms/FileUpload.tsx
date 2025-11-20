import { AlertCircle, Building2, CheckCircle2, CreditCard, FileText, Mail, Phone, User, Users, Plus, Trash2, Upload } from "lucide-react"
import { useState } from "react"

export function FileUpload({
  label,
  sublabel, 
  accept = ".pdf",
  maxSize = "1 MB"
}: {
  label: string;
  sublabel?: string;   
  accept?: string;
  maxSize?: string;
}) {

    const [file, setFile] = useState(null)

    return (
        <div className="space-y-2">
            <label className="flex items-start gap-2 text-sm font-medium text-gray-700">
                <Upload className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                    <span>{label}</span>
                    {sublabel && (
                        <span className="text-xs text-gray-500">{sublabel}</span>
                    )}
                </div>
            </label>

            <div className="relative">
                <input
                    type="file"
                    accept={accept}
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id={`file-${label.substring(0, 20)}`}
                />
                <label
                    htmlFor={`file-${label.substring(0, 20)}`}
                    className="flex items-center justify-between w-full border-2 border-dashed border-gray-300 hover:border-blue-400 rounded-lg p-4 cursor-pointer transition-all group bg-gray-50 hover:bg-blue-50"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                            <Upload className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                {file ? file.name : 'Click para subir archivo'}
                            </p>
                            <p className="text-xs text-gray-500">Máx. {maxSize}</p>
                        </div>
                    </div>
                    {file && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                </label>
            </div>
        </div>
    )
}