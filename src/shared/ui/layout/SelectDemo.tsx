import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Seleccione una opción" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="uno">Uno</SelectItem>
        <SelectItem value="dos">Dos</SelectItem>
        <SelectItem value="tres">Tres</SelectItem>
      </SelectContent>
    </Select>
  )
}
