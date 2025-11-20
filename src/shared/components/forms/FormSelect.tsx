import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { LucideIcon } from "lucide-react"

interface FormSelectProps {
  icon: LucideIcon
  label: string
  options: string[]
  value?: string
  onChange?: (value: string) => void
}

export function FormSelect({ 
  icon: Icon, 
  label, 
  options,
  value,
  onChange 
}: FormSelectProps) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-600" />
        {label}
      </label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
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
    </div>
  )
}
