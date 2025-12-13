import { FormInput } from "./FormInput";
import { User, CreditCard, FileText, Building2, Trash2 } from "lucide-react"
import { FormSelect } from "./FormSelect";

interface TeacherData {
    nombres: string
    apellidos: string
    dni: string
    orcid: string
    escuela: string
}

interface AddTeacherFormProps {
    number: number
    canRemove: boolean
    onRemove: () => void
    data?: TeacherData
    onChange?: (data: TeacherData) => void
}

export function AddTeacherForm({ number, canRemove, onRemove, data, onChange }: AddTeacherFormProps) {
    const formData: TeacherData = data || {
        nombres: '',
        apellidos: '',
        dni: '',
        orcid: '',
        
        escuela: ''
    }

    const handleChange = (field: keyof TeacherData, value: string) => {
        if (onChange) {
            onChange({ ...formData, [field]: value })
        }
    }

    return (
        <div className="border border-gray-200 rounded-xl p-4 md:p-5 bg-gray-50/60 space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                    </div>
                    Autor {number}
                </h4>
                {canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                    >
                        <Trash2 className="w-3 h-3" />
                        Quitar
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    icon={User}
                    label="Nombres"
                    type="text"
                    placeholder="Ingresa tus nombres"
                    value={formData.nombres}
                    onChange={(e) => handleChange('nombres', e.target.value)}
                />
                <FormInput
                    icon={User}
                    label="Apellidos"
                    type="text"
                    placeholder="Ingresa tus apellidos"
                    value={formData.apellidos}
                    onChange={(e) => handleChange('apellidos', e.target.value)}
                />
                <FormInput
                    icon={CreditCard}
                    label="Número de DNI"
                    type="text"
                    placeholder="12345678"
                    maxLength={8}
                    value={formData.dni}
                    onChange={(e) => handleChange('dni', e.target.value)}
                />
                <FormInput
                    icon={FileText}
                    label="URL de ORCID"
                    type="text"
                    placeholder="0000-0000-0000-0000"
                    value={formData.orcid}
                    onChange={(e) => handleChange('orcid', e.target.value)}
                />
                <FormSelect
                    icon={Building2}
                    label="Escuela Profesional"
                    value={formData.escuela}
                    onChange={(value) => handleChange('escuela', value)}
                    options={[
                        "Ingeniería informática y sistemas",
                        "Ingeniería Civil",
                        "Ingeniería de Minas",
                        "Ingeniería Agroindustrial",
                        "Ingeniería Agroecológica y Desarrollo Rural",
                        "Administración",
                        "Ciencia Política y Gobernabilidad",
                        "Educación inicial intercultural y bilingüe 1ra y 2da infancia",
                        "Medicina Veterinaria y zootécnia",
                    ]}
                />
            </div>
        </div>
    );
}
