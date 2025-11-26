import { CreditCard, FileText, User, Trash2, MapPinned } from "lucide-react"
import { FormInput } from "./FormInput"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface CoautorData {
  tipoUbicacion: 'externo' | 'interno' | ''
  tipoRol: 'estudiante' | 'docente' | ''
  nombre: string
  apellido: string
  dni: string
  orcid: string
}

interface CoautorFormProps {
  number: number
  onRemove: () => void
  canRemove: boolean
  data?: CoautorData
  onChange?: (data: CoautorData) => void
}

export function CoautorForm({ number, onRemove, canRemove, data, onChange }: CoautorFormProps) {
  const formData: CoautorData = data || {
    tipoUbicacion: '',
    tipoRol: '',
    nombre: '',
    apellido: '',
    dni: '',
    orcid: ''
  }

  const handleChange = (field: keyof CoautorData, value: string) => {
    if (onChange) {
      onChange({ ...formData, [field]: value })
    }
  }

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

      <div>
        <RadioGroup 
          value={formData.tipoUbicacion} 
          onValueChange={(value) => handleChange('tipoUbicacion', value)}
        >
          <div className="flex items-center px-1 gap-2">
            <MapPinned className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600">Seleccione si el coautor es externo o interno</span>
          </div>
          <div className="grid grid-cols-2 w-full px-2">
            <div className="flex items-center gap-3">
              <RadioGroupItem 
                value="externo" 
                id={`ubicacion-externo-${number}`} 
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600" 
              />
              <Label htmlFor={`ubicacion-externo-${number}`} className="font-normal capitalize">Externo</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem 
                value="interno" 
                id={`ubicacion-interno-${number}`} 
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600" 
              />
              <Label htmlFor={`ubicacion-interno-${number}`} className="font-normal capitalize">Interno</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div>
        <RadioGroup 
          value={formData.tipoRol} 
          onValueChange={(value) => handleChange('tipoRol', value)}
        >
          <div className="flex items-center px-1 gap-2">
            <MapPinned className="w-4 h-4 text-blue-500" />
            <span className="text-xs text-gray-600">Seleccione si el coautor es estudiante o docente</span>
          </div>
          <div className="grid grid-cols-2 w-full px-2">
            <div className="flex items-center gap-3">
              <RadioGroupItem 
                value="estudiante" 
                id={`rol-estudiante-${number}`} 
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600" 
              />
              <Label htmlFor={`rol-estudiante-${number}`} className="font-normal capitalize">Estudiante</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem 
                value="docente" 
                id={`rol-docente-${number}`} 
                className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600" 
              />
              <Label htmlFor={`rol-docente-${number}`} className="font-normal capitalize">Docente</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          icon={User}
          label="Nombres"
          sublabel="(En mayúsculas y minúsculas según corresponda)"
          type="text"
          placeholder="Ejem: Gustavo"
          value={formData.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
        />
        <FormInput
          icon={User}
          label="Apellidos"
          sublabel="(En mayúsculas y minúsculas según corresponda)"
          type="text"
          placeholder="Ejem:vRobles Rojas"
          value={formData.apellido}
          onChange={(e) => handleChange('apellido', e.target.value)}
        />
        <FormInput
          icon={CreditCard}
          label="Número de DNI"
          type="text"
          placeholder="Ejem: 78345758"
          maxLength={8}
          value={formData.dni}
          onChange={(e) => handleChange('dni', e.target.value)}
        />
        <FormInput
          icon={FileText}
          label="Url de ORCID"
          type="text"
          placeholder="0000-0000-0000-0000"
          value={formData.orcid}
          onChange={(e) => handleChange('orcid', e.target.value)}
        />
      </div>
    </div>
  )
}
