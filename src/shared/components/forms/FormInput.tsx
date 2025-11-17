import { LucideIcon } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  label: string;
  sublabel?: string;
}

export function FormInput({ icon: Icon, label, sublabel, ...props }: FormInputProps) {
    return (
        <div className="space-y-2">
            <label className="flex items-start gap-2 text-sm font-medium text-gray-700">
                {Icon && <Icon className="w-4 h-4 text-blue-600 mt-0.5" />}
                <div className="flex flex-col">
                    <span>{label}</span>
                    {sublabel && <span className="text-xs font-normal text-gray-500">{sublabel}</span>}
                </div>
            </label>
            <input
                {...props}
                className="w-full outline-none border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 py-2.5 px-4 rounded-lg text-sm transition-all hover:border-gray-300"
            />
        </div>
    )
}