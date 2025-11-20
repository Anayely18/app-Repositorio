import { CreditCard, FileText, User, Trash2 } from "lucide-react"
import { FormInput } from "./FormInput"

interface AdvisorData {
  nombre?: string
  dni?: string
  orcid?: string
}

interface AsesorFormProps {
  number: number
  onRemove: () => void
  canRemove: boolean
  data: AdvisorData
  onChange: (data: AdvisorData) => void
}

export function AsesorForm({ 
  number, 
  onRemove, 
  canRemove,
  data = {},
  onChange 
}: AsesorFormProps) {
  return (
    <div className="border-2 border-gray-200 rounded-xl p-6 space-y-4 bg-linear-to-br from-gray-50 to-white hover:border-blue-300 transition-all">
      <div className="flex items-center justify-between">
        <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          Asesor {number}
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
      
      <div className="grid gap-4">
        <FormInput
          icon={User}
          label="Apellidos y nombres"
          sublabel="(En mayúsculas y minúsculas según corresponda)"
          type="text"
          placeholder="Robles Rojas Gustavo"
          value={data.nombre || ""}
          onChange={(e) => onChange({ ...data, nombre: e.target.value })}
        />
        <FormInput
          icon={CreditCard}
          label="Número de DNI"
          type="text"
          placeholder="78345758"
          maxLength={8}
          value={data.dni || ""}
          onChange={(e) => onChange({ ...data, dni: e.target.value })}
        />
        <FormInput
          icon={FileText}
          label="Url de ORCID"
          type="text"
          placeholder="0000-0000-0000-0000"
          value={data.orcid || ""}
          onChange={(e) => onChange({ ...data, orcid: e.target.value })}
        />
      </div>
    </div>
  )
}
