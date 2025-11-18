import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { LucideIcon } from "lucide-react"

interface Props {
  icon: LucideIcon
  label: string
  options: string[]
}

export function FormSelect({ icon: Icon, label, options }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-600" />
        {label}
      </label>

      <Select>
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
