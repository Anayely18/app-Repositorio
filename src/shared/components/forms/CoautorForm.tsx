import { CreditCard, FileText, User, Trash2, MapPinned } from "lucide-react"
import { FormInput } from "./FormInput"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function CoautorForm({ number, onRemove, canRemove }) {
  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 flex flex-col gap-y-6 bg-linear-to-br from-gray-50 to-white hover:border-blue-300 transition-all">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          Co-autor {number}
        </h4>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="">
        <RadioGroup defaultValue="comfortable">
          <div className="flex items-center px-1 gap-2">
            <MapPinned className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600">Seleccion si el coautor es externo o interno</span>
          </div>
          <div className="grid grid-cols-2 w-full px-2">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="default" id="r1" className="data-[state=checked]:border-green-600 data-[state=checked]:bg-blue-600" />
              <Label htmlFor="r1" className="font-normal capitalize">Estudiante</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="comfortable" id="r2" className="data-[state=checked]:border-green-600 data-[state=checked]:bg-blue-600" />
              <Label htmlFor="r2" className="font-normal capitalize">Interno</Label>
            </div>
          </div>
        </RadioGroup>
      </div>
      <div >
        <RadioGroup defaultValue="comfortable">
          <div className="flex items-center px-1 gap-2">
            <MapPinned className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600">Selecciona si el coautor es estudiante o docente</span>
          </div>
          <div className="grid grid-cols-2 w-full px-2">
            <div className="flex items-center gap-3">
              <RadioGroupItem value="default" id="r1" className="data-[state=checked]:border-green-600 data-[state=checked]:bg-blue-600" />
              <Label htmlFor="r1" className="font-normal capitalize">Estudiante</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="comfortable" id="r2" className="data-[state=checked]:border-green-600 data-[state=checked]:bg-blue-600" />
              <Label htmlFor="r2" className="font-normal capitalize">Docente</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="grid gap-4">
        <FormInput
          icon={User}
          label="Apellidos y nombres"
          sublabel="(En mayúsculas y minúsculas según corresponda)"
          type="text"
          placeholder="Robles Rojas Gustavo"
        />
        <FormInput
          icon={CreditCard}
          label="Número de DNI"
          type="text"
          placeholder="78345758"
          maxLength={8}
        />
        <FormInput
          icon={FileText}
          label="Url de ORCID"
          type="text"
          placeholder="0000-0000-0000-0000"
        />
      </div>
    </div>
  )
}